import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const jdnToDateExample = {
  input: { jdn: 2451545 },
  output: { date: "2000-01-01" },
} satisfies ToolExample<{ readonly jdn: number }, { readonly date: string }>;

export const calculateJdnToDate = (input: {
  readonly jdn: number;
}): { readonly date: string } => {
  if (input.jdn < 0)
    simpleError("jdn", "The JDN cannot be negative.", "invalid_jdn");
  let j = input.jdn + 32044;
  const a = Math.floor((4 * j + 3) / 146097);
  j -= Math.floor((146097 * a) / 4);
  const b = Math.floor((4 * j + 3) / 1461);
  j -= Math.floor((1461 * b) / 4);
  const m = Math.floor((5 * j + 2) / 153);
  const day = j - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * a + b - 4800 + Math.floor(m / 10);
  return {
    date: `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  };
};

export const jdnToDateTool = createSimpleTool({
  calculate: (input) =>
    calculateJdnToDate(input as unknown as { readonly jdn: number }),
  description: "Convert a Julian Day Number back to a Gregorian calendar date.",
  id: "date/julian-day-number-to-date",
  inputs: [
    {
      description: "Julian Day Number.",
      id: "jdn",
      kind: "integer",
      label: "JDN",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Gregorian date in YYYY-MM-DD format.",
      id: "date",
      kind: "string",
      label: "Date",
    },
  ],
  title: "Julian Day Number to Date Converter",
});
export const runJdnToDate = jdnToDateTool.execute;
export default jdnToDateTool;
