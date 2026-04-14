"use client";

import { useEffect, useMemo, useState } from "react";

type College = {
  id: string;
  name: string;
  slug: string;
  state: string;
  city: string;
  address: string;
  description: string;
  establishedYear: number;
  type: string;
  approval: string;
  logo: string | null;
  bannerImage: string | null;
};

type Course = {
  id: string;
  name: string;
  slug: string;
  duration: number;
  category: string;
  fees: number;
  eligibility: string;
  college: { id: string; name: string };
};

type Props = {
  token: string;
};

export function AdminForm({ token }: Props) {
  const authHeader = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [colleges, setColleges] = useState<College[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<{ colleges: number; courses: number }>({
    colleges: 0,
    courses: 0,
  });

  const [message, setMessage] = useState<string>("");

  async function refresh() {
    const [collegesRes, coursesRes] = await Promise.all([
      fetch("/api/colleges?pageSize=24&sort=createdAt&order=desc", {
        cache: "no-store",
      }),
      fetch("/api/courses?pageSize=24&sort=name&order=asc", { cache: "no-store" }),
    ]);

    const collegesJson = await collegesRes.json();
    const coursesJson = await coursesRes.json();

    const collegeData: College[] = collegesJson?.data ?? [];
    const courseData = (coursesJson?.data ?? []) as Array<{
      id: string;
      name: string;
      slug: string;
      duration: number;
      category: string;
      fees: number;
      eligibility: string;
      college: { id: string; name: string };
    }>;

    setColleges(collegeData);
    setCourses(
      courseData.map((c) => ({
        ...c,
        college: { id: c.college.id, name: c.college.name },
      })),
    );
    setStats({ colleges: collegesJson?.meta?.total ?? collegeData.length, courses: coursesJson?.meta?.total ?? courseData.length });
  }

  useEffect(() => {
    refresh().catch(() => {
      setMessage("Failed to load admin data.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function api<T>(url: string, init: RequestInit): Promise<T> {
    const res = await fetch(url, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(init.headers ?? {}),
        ...authHeader,
      },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json?.error || `Request failed (${res.status})`);
    }
    return json as T;
  }

  // Add college
  const [newCollege, setNewCollege] = useState({
    name: "",
    state: "",
    city: "",
    address: "",
    description: "",
    establishedYear: "",
    type: "Private",
    approval: "AICTE",
  });

  async function createCollege() {
    setMessage("");
    await api("/api/colleges", {
      method: "POST",
      body: JSON.stringify({
        ...newCollege,
        establishedYear: Number(newCollege.establishedYear),
      }),
    });
    setNewCollege({
      name: "",
      state: "",
      city: "",
      address: "",
      description: "",
      establishedYear: "",
      type: "Private",
      approval: "AICTE",
    });
    setMessage("College created.");
    await refresh();
  }

  // Add course
  const [newCourse, setNewCourse] = useState({
    name: "",
    duration: "2",
    category: "Management",
    fees: "",
    eligibility: "",
    collegeId: "",
  });

  async function createCourse() {
    setMessage("");
    await api("/api/courses", {
      method: "POST",
      body: JSON.stringify({
        ...newCourse,
        duration: Number(newCourse.duration),
        fees: Number(newCourse.fees),
      }),
    });
    setNewCourse({
      name: "",
      duration: "2",
      category: "Management",
      fees: "",
      eligibility: "",
      collegeId: "",
    });
    setMessage("Course created.");
    await refresh();
  }

  async function deleteCollege(id: string) {
    setMessage("");
    await api(`/api/colleges?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setMessage("College deleted.");
    await refresh();
  }

  async function deleteCourse(id: string) {
    setMessage("");
    await api(`/api/courses?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setMessage("Course deleted.");
    await refresh();
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-900/5 bg-white p-5 shadow-md dark:border-white/10 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Overview</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Stat label="Total colleges" value={stats.colleges} />
          <Stat label="Total courses" value={stats.courses} />
        </div>
        {message ? (
          <div className="mt-4 rounded-xl bg-blue-600/10 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
            {message}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-900/5 bg-white p-5 shadow-md dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Add college</h2>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <Input label="Name" value={newCollege.name} onChange={(v) => setNewCollege((s) => ({ ...s, name: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="State" value={newCollege.state} onChange={(v) => setNewCollege((s) => ({ ...s, state: v }))} />
              <Input label="City" value={newCollege.city} onChange={(v) => setNewCollege((s) => ({ ...s, city: v }))} />
            </div>
            <Input label="Address" value={newCollege.address} onChange={(v) => setNewCollege((s) => ({ ...s, address: v }))} />
            <Textarea label="Description" value={newCollege.description} onChange={(v) => setNewCollege((s) => ({ ...s, description: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Established Year"
                value={newCollege.establishedYear}
                onChange={(v) => setNewCollege((s) => ({ ...s, establishedYear: v }))}
              />
              <Input label="Type" value={newCollege.type} onChange={(v) => setNewCollege((s) => ({ ...s, type: v }))} />
            </div>
            <Input label="Approval" value={newCollege.approval} onChange={(v) => setNewCollege((s) => ({ ...s, approval: v }))} />
            <button
              type="button"
              onClick={() => createCollege().catch((e) => setMessage(e.message))}
              className="mt-2 h-11 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create college
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-900/5 bg-white p-5 shadow-md dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Add course</h2>
          <div className="mt-4 grid grid-cols-1 gap-3">
            <Input label="Name" value={newCourse.name} onChange={(v) => setNewCourse((s) => ({ ...s, name: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Duration"
                value={newCourse.duration}
                onChange={(v) => setNewCourse((s) => ({ ...s, duration: v }))}
                options={[
                  { value: "2", label: "2 Years" },
                  { value: "3", label: "3 Years" },
                ]}
              />
              <Input label="Category" value={newCourse.category} onChange={(v) => setNewCourse((s) => ({ ...s, category: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Fees" value={newCourse.fees} onChange={(v) => setNewCourse((s) => ({ ...s, fees: v }))} />
              <Input
                label="College Id"
                value={newCourse.collegeId}
                onChange={(v) => setNewCourse((s) => ({ ...s, collegeId: v }))}
              />
            </div>
            <Textarea
              label="Eligibility"
              value={newCourse.eligibility}
              onChange={(v) => setNewCourse((s) => ({ ...s, eligibility: v }))}
            />
            <button
              type="button"
              onClick={() => createCourse().catch((e) => setMessage(e.message))}
              className="mt-2 h-11 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create course
            </button>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Tip: copy the college id from the list below.
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-slate-900/5 bg-white p-5 shadow-md dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Manage colleges</h2>
          <button
            type="button"
            onClick={() => refresh().catch(() => setMessage("Failed to refresh"))}
            className="rounded-xl border border-slate-900/10 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Location</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Approval</th>
                <th className="py-2 pr-4">Id</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-800 dark:text-slate-100">
              {colleges.map((c) => (
                <tr key={c.id} className="border-t border-slate-900/5 dark:border-white/10">
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="py-3 pr-4">
                    {c.city}, {c.state}
                  </td>
                  <td className="py-3 pr-4">{c.type}</td>
                  <td className="py-3 pr-4">{c.approval}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-600 dark:text-slate-300">{c.id}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => deleteCollege(c.id).catch((e) => setMessage(e.message))}
                      className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-900/5 bg-white p-5 shadow-md dark:border-white/10 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Manage courses</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs text-slate-600 dark:text-slate-300">
              <tr>
                <th className="py-2 pr-4">Course</th>
                <th className="py-2 pr-4">College</th>
                <th className="py-2 pr-4">Duration</th>
                <th className="py-2 pr-4">Fees</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-800 dark:text-slate-100">
              {courses.map((c) => (
                <tr key={c.id} className="border-t border-slate-900/5 dark:border-white/10">
                  <td className="py-3 pr-4 font-medium">{c.name}</td>
                  <td className="py-3 pr-4">{c.college.name}</td>
                  <td className="py-3 pr-4">{c.duration} Years</td>
                  <td className="py-3 pr-4">₹{c.fees.toLocaleString("en-IN")}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => deleteCourse(c.id).catch((e) => setMessage(e.message))}
                      className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-900/5 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950">
      <div className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-slate-900/5 bg-white px-3 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-slate-900/5 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-slate-900/5 bg-white px-3 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
