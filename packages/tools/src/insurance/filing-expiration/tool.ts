import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly filingStartDate: string;
  readonly requiredDurationMonths: number;
  readonly asOfDate: string;
}>;
export type Output = Readonly<{
  readonly expirationDate: string;
  readonly monthsRemaining: number;
  readonly expired: boolean;
}>;

export const calculate = (input: Input): Output => {
  const start = new Date(`${input.filingStartDate}T00:00:00Z`),
    asOf = new Date(`${input.asOfDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(asOf.getTime()))
    simpleError("filingStartDate", "Dates must be valid.", "invalid_dates");
  const expiration = new Date(start);
  expiration.setUTCMonth(
    expiration.getUTCMonth() + input.requiredDurationMonths,
  );
  const raw =
      (expiration.getUTCFullYear() - asOf.getUTCFullYear()) * 12 +
      expiration.getUTCMonth() -
      asOf.getUTCMonth(),
    monthsRemaining = Math.max(
      0,
      raw - (expiration.getUTCDate() < asOf.getUTCDate() ? 1 : 0),
    );
  return {
    expirationDate: expiration.toISOString().slice(0, 10),
    monthsRemaining,
    expired: asOf >= expiration,
  };
};

export const exampleInput = {
  filingStartDate: "2025-01-01",
  requiredDurationMonths: 12,
  asOfDate: "2025-07-01",
} satisfies Input;
export const exampleOutput = {
  expirationDate: "2026-01-01",
  monthsRemaining: 6,
  expired: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      filingStartDate: input.filingStartDate as string,
      requiredDurationMonths: input.requiredDurationMonths as number,
      asOfDate: input.asOfDate as string,
    }),
  description:
    "Calculate a financial-responsibility filing expiration from a supplied duration.",
  id: "insurance/filing-expiration",
  inputs: [
    { id: "filingStartDate", label: "Filing start date", kind: "string" },
    {
      id: "requiredDurationMonths",
      label: "Required filing duration",
      kind: "integer",
      minimum: 0,
      unit: "months",
    },
    { id: "asOfDate", label: "As-of date", kind: "string" },
  ],
  outputs: [
    { id: "expirationDate", label: "Filing expiration date", kind: "string" },
    {
      id: "monthsRemaining",
      label: "Whole months remaining",
      kind: "integer",
      minimum: 0,
    },
    { id: "expired", label: "Filing has expired", kind: "boolean" },
  ],
  title: "Filing Expiration",
});

export const run = tool.execute;
export default tool;
