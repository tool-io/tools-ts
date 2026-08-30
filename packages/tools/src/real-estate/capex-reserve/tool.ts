import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CapexReserveInput = Readonly<{
  readonly monthlyReservePerUnit: number;
  readonly unitCount: number;
}>;
export type CapexReserveOutput = Readonly<{
  readonly annualReserve: number;
}>;

export const calculateCapexReserve = (
  x: CapexReserveInput,
): CapexReserveOutput => {
  if (!Number.isFinite(x.monthlyReservePerUnit) || x.monthlyReservePerUnit < 0)
    simpleError(
      "monthlyReservePerUnit",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.unitCount) || x.unitCount < 0)
    simpleError("unitCount", "Provide a finite nonnegative number.");
  if (!Number.isInteger(x.unitCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const annualReserve = 12 * x.monthlyReservePerUnit * x.unitCount;
  if (!Number.isFinite(annualReserve))
    simpleError(
      "annualReserve",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { annualReserve: Object.is(annualReserve, -0) ? 0 : annualReserve };
};

export const example = {
  input: {
    monthlyReservePerUnit: 50,
    unitCount: 10,
  },
  output: { annualReserve: 6000 },
} satisfies ToolExample<CapexReserveInput, CapexReserveOutput>;

export const tool = createSimpleTool({
  id: "real-estate/capex-reserve",
  title: "Capex Reserve",
  description:
    "Annual capital expenditure reserve from a per-unit monthly allowance and property unit count.",
  inputs: [
    {
      id: "monthlyReservePerUnit",
      kind: "number",
      label: "Monthly Reserve Per Unit",
      unit: "currency",
      minimum: 0,
    },
    { id: "unitCount", kind: "number", label: "Unit Count", minimum: 0 },
  ],
  outputs: [
    {
      id: "annualReserve",
      kind: "number",
      label: "Annual Reserve",
      unit: "currency",
    },
  ],
  calculate: (input) =>
    calculateCapexReserve({
      monthlyReservePerUnit: input.monthlyReservePerUnit as number,
      unitCount: input.unitCount as number,
    }),
});
export const capexReserveTool = tool;
export const runCapexReserve = tool.execute;
export default tool;
