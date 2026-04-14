"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export type FilterKind = "colleges" | "courses";

type Props = {
  kind: FilterKind;
  options: {
    states: string[];
    cities: string[];
    types: string[];
    approvals: string[];
    categories?: string[];
  };
};

function uniqSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function FilterSidebar({ kind, options }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const getParam = (key: string) => sp?.get(key) ?? "";

  const initial = useMemo(
    () => ({
      state: getParam("state"),
      city: getParam("city"),
      type: getParam("type"),
      approval: getParam("approval"),
      category: getParam("category"),
      feesMin: getParam("feesMin"),
      feesMax: getParam("feesMax"),
      sort: getParam("sort") || (kind === "courses" ? "fees" : "name"),
      order: getParam("order") || "asc",
    }),
    // sp can be null and its identity can change; using its string snapshot keeps memo stable
    // across renders while still reacting to URL updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sp?.toString(), kind],
  );

  const [state, setState] = useState(initial.state);
  const [city, setCity] = useState(initial.city);
  const [type, setType] = useState(initial.type);
  const [approval, setApproval] = useState(initial.approval);
  const [category, setCategory] = useState(initial.category);
  const [feesMin, setFeesMin] = useState(initial.feesMin);
  const [feesMax, setFeesMax] = useState(initial.feesMax);
  const [sort, setSort] = useState(initial.sort);
  const [order, setOrder] = useState(initial.order);

  function apply() {
    const params = new URLSearchParams(sp?.toString() ?? "");

    const setOrDelete = (key: string, val: string) => {
      const v = val.trim();
      if (v) params.set(key, v);
      else params.delete(key);
    };

    setOrDelete("state", state);
    setOrDelete("city", city);
    setOrDelete("type", type);
    setOrDelete("approval", approval);

    if (kind === "courses") {
      setOrDelete("category", category);
      setOrDelete("feesMin", feesMin);
      setOrDelete("feesMax", feesMax);
    } else {
      params.delete("category");
      params.delete("feesMin");
      params.delete("feesMax");
    }

    setOrDelete("sort", sort);
    setOrDelete("order", order);

    params.delete("page");

    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?");
  }

  function reset() {
    setState("");
    setCity("");
    setType("");
    setApproval("");
    setCategory("");
    setFeesMin("");
    setFeesMax("");
    setSort(kind === "courses" ? "fees" : "name");
    setOrder("asc");

    const params = new URLSearchParams(sp?.toString() ?? "");
    for (const key of [
      "state",
      "city",
      "type",
      "approval",
      "category",
      "feesMin",
      "feesMax",
      "sort",
      "order",
      "page",
    ]) {
      params.delete(key);
    }
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?");
  }

  const states = uniqSorted(options.states);
  const cities = uniqSorted(options.cities);
  const types = uniqSorted(options.types);
  const approvals = uniqSorted(options.approvals);
  const categories = uniqSorted(options.categories ?? []);

  return (
    <aside className="rounded-xl border border-slate-900/5 bg-white p-4 shadow-md dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Filters</h2>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <Select label="State" value={state} onChange={setState} options={states} />
        <Select label="City" value={city} onChange={setCity} options={cities} />
        <Select label="Type" value={type} onChange={setType} options={types} />
        <Select label="Approval" value={approval} onChange={setApproval} options={approvals} />

        {kind === "courses" ? (
          <>
            <Select label="Category" value={category} onChange={setCategory} options={categories} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Fees Min" value={feesMin} onChange={setFeesMin} />
              <Input label="Fees Max" value={feesMax} onChange={setFeesMax} />
            </div>
          </>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Sort"
            value={sort}
            onChange={setSort}
            options={kind === "courses" ? ["fees", "name"] : ["name", "createdAt", "establishedYear"]}
            allowRaw
          />
          <Select label="Order" value={order} onChange={setOrder} options={["asc", "desc"]} allowRaw />
        </div>

        <button
          type="button"
          onClick={apply}
          className="mt-2 h-11 w-full rounded-xl bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
    </aside>
  );
}

type SelectProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allowRaw?: boolean;
};

function Select({ label, value, onChange, options, allowRaw }: SelectProps) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-slate-900/5 bg-white px-3 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white"
      >
        <option value="">All</option>
        {(allowRaw ? options : options).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

function Input({ label, value, onChange }: InputProps) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="numeric"
        className="h-10 w-full rounded-xl border border-slate-900/5 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-white"
        placeholder="0"
      />
    </label>
  );
}
