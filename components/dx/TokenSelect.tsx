"use client";
import { useSymbols } from "@/hooks/useDynexus";
import { inputClass } from "./ui";

export default function TokenSelect({
  id,
  tokens,
  value,
  onChange,
}: {
  id: string;
  tokens: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const symbols = useSymbols(tokens);
  return (
    <select id={id} className={inputClass} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select token</option>
      {tokens.map((t) => (
        <option key={t} value={t}>
          {symbols[t]}
        </option>
      ))}
    </select>
  );
}
