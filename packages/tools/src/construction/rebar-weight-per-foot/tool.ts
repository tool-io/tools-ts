import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RebarWeightPerFootInput = Readonly<{
  readonly diameterMm: number;
  readonly steelDensityKgPerM3: number;
}>;
export type RebarWeightPerFootOutput = Readonly<{
  readonly massKgPerFoot: number;
}>;

export const calculateRebarWeightPerFoot = (
  x: RebarWeightPerFootInput,
): RebarWeightPerFootOutput => {
  if (!Number.isFinite(x.diameterMm) || x.diameterMm < 0)
    simpleError("diameterMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.steelDensityKgPerM3) || x.steelDensityKgPerM3 < 0)
    simpleError("steelDensityKgPerM3", "Provide a finite number at least 0.");
  const massKgPerFoot =
    ((x.steelDensityKgPerM3 * Math.PI * (x.diameterMm / 1000) ** 2) / 4) *
    0.3048;
  if (!Number.isFinite(massKgPerFoot))
    simpleError("massKgPerFoot", "The inputs produce an invalid result.");
  return { massKgPerFoot: Object.is(massKgPerFoot, -0) ? 0 : massKgPerFoot };
};

export const example = {
  input: { diameterMm: 12, steelDensityKgPerM3: 7850 },
  output: { massKgPerFoot: 0.2706057327740842 },
} satisfies ToolExample<RebarWeightPerFootInput, RebarWeightPerFootOutput>;

export const tool = createSimpleTool({
  id: "construction/rebar-weight-per-foot",
  title: "Rebar Weight Per Foot",
  description:
    "Compute steel reinforcing-bar mass per foot from nominal circular diameter and supplied steel density.",
  inputs: [
    {
      id: "diameterMm",
      kind: "number",
      label: "Bar diameter",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "steelDensityKgPerM3",
      kind: "number",
      label: "Steel density",
      unit: "kg/m³",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "massKgPerFoot",
      kind: "number",
      label: "Mass per foot",
      unit: "kg/ft",
    },
  ],
  calculate: (input) =>
    calculateRebarWeightPerFoot({
      diameterMm: input.diameterMm as number,
      steelDensityKgPerM3: input.steelDensityKgPerM3 as number,
    }),
});
export const rebarWeightPerFootTool = tool;
export const runRebarWeightPerFoot = tool.execute;
export default tool;
