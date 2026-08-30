import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RebarTotalWeightInput = Readonly<{
  readonly combinedLengthM: number;
  readonly massPerMeterKg: number;
}>;
export type RebarTotalWeightOutput = Readonly<{
  readonly totalMassKg: number;
}>;

export const calculateRebarTotalWeight = (
  x: RebarTotalWeightInput,
): RebarTotalWeightOutput => {
  if (!Number.isFinite(x.combinedLengthM) || x.combinedLengthM < 0)
    simpleError("combinedLengthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.massPerMeterKg) || x.massPerMeterKg < 0)
    simpleError("massPerMeterKg", "Provide a finite number at least 0.");
  const totalMassKg = x.combinedLengthM * x.massPerMeterKg;
  if (!Number.isFinite(totalMassKg))
    simpleError("totalMassKg", "The inputs produce an invalid result.");
  return { totalMassKg: Object.is(totalMassKg, -0) ? 0 : totalMassKg };
};

export const example = {
  input: { combinedLengthM: 50, massPerMeterKg: 1 },
  output: { totalMassKg: 50 },
} satisfies ToolExample<RebarTotalWeightInput, RebarTotalWeightOutput>;

export const tool = createSimpleTool({
  id: "construction/rebar-total-weight",
  title: "Rebar Total Weight",
  description:
    "Calculate total reinforcing-bar mass from combined cut length and mass per unit length.",
  inputs: [
    {
      id: "combinedLengthM",
      kind: "number",
      label: "Combined bar length",
      unit: "m",
      minimum: 0,
    },
    {
      id: "massPerMeterKg",
      kind: "number",
      label: "Mass per meter",
      unit: "kg/m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "totalMassKg", kind: "number", label: "Rebar mass", unit: "kg" },
  ],
  calculate: (input) =>
    calculateRebarTotalWeight({
      combinedLengthM: input.combinedLengthM as number,
      massPerMeterKg: input.massPerMeterKg as number,
    }),
});
export const rebarTotalWeightTool = tool;
export const runRebarTotalWeight = tool.execute;
export default tool;
