import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InclinedPlaneEffortInput = Readonly<{
  readonly loadNewtons: number;
  readonly riseMeters: number;
  readonly slopeLengthMeters: number;
}>;
export type InclinedPlaneEffortOutput = Readonly<{
  readonly effortNewtons: number;
}>;

export const calculateInclinedPlaneEffort = (
  x: InclinedPlaneEffortInput,
): InclinedPlaneEffortOutput => {
  if (!Number.isFinite(x.loadNewtons) || x.loadNewtons < 0)
    simpleError("loadNewtons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.riseMeters) || x.riseMeters < 0)
    simpleError("riseMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.slopeLengthMeters) || x.slopeLengthMeters < 0)
    simpleError("slopeLengthMeters", "Provide a finite number at least 0.");
  if (x.riseMeters > x.slopeLengthMeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const effortNewtons = (x.loadNewtons * x.riseMeters) / x.slopeLengthMeters;
  if (!Number.isFinite(effortNewtons))
    simpleError(
      "effortNewtons",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { effortNewtons: Object.is(effortNewtons, -0) ? 0 : effortNewtons };
};

export const example = {
  input: { loadNewtons: 100, riseMeters: 1, slopeLengthMeters: 5 },
  output: { effortNewtons: 20 },
} satisfies ToolExample<InclinedPlaneEffortInput, InclinedPlaneEffortOutput>;

export const tool = createSimpleTool({
  id: "engineering/inclined-plane-effort",
  title: "Inclined Plane Effort",
  description:
    "Ideal force parallel to a frictionless incline needed to raise a load at constant speed: W h/L.",
  inputs: [
    {
      id: "loadNewtons",
      kind: "number",
      label: "Load Newtons",
      unit: "N",
      minimum: 0,
    },
    {
      id: "riseMeters",
      kind: "number",
      label: "Rise Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "slopeLengthMeters",
      kind: "number",
      label: "Slope Length Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "effortNewtons", kind: "number", label: "Effort Newtons", unit: "N" },
  ],
  calculate: (input) =>
    calculateInclinedPlaneEffort({
      loadNewtons: input.loadNewtons as number,
      riseMeters: input.riseMeters as number,
      slopeLengthMeters: input.slopeLengthMeters as number,
    }),
});
export const inclinedPlaneEffortTool = tool;
export const runInclinedPlaneEffort = tool.execute;
export default tool;
