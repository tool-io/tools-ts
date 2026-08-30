import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OtdrResolutionInput = Readonly<{
  readonly pulseDurationS: number;
  readonly groupIndex: number;
}>;
export type OtdrResolutionOutput = Readonly<{
  readonly spatialResolutionM: number;
}>;

export const calculateOtdrResolution = (
  x: OtdrResolutionInput,
): OtdrResolutionOutput => {
  if (!Number.isFinite(x.pulseDurationS) || x.pulseDurationS < 0)
    simpleError("pulseDurationS", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.groupIndex) || x.groupIndex < 1)
    simpleError("groupIndex", "Provide a finite number at least 1.");
  if (!(x.groupIndex >= 1))
    simpleError("groupIndex", "Group index must be at least one.");
  const spatialResolutionM =
    (299792458 * x.pulseDurationS) / (2 * x.groupIndex);
  if (!Number.isFinite(spatialResolutionM))
    simpleError("spatialResolutionM", "The inputs produce an invalid result.");
  return {
    spatialResolutionM: Object.is(spatialResolutionM, -0)
      ? 0
      : spatialResolutionM,
  };
};

export const example = {
  input: { pulseDurationS: 1e-8, groupIndex: 1.5 },
  output: { spatialResolutionM: 0.9993081933333334 },
} satisfies ToolExample<OtdrResolutionInput, OtdrResolutionOutput>;

export const tool = createSimpleTool({
  id: "electronics/otdr-resolution",
  title: "OTDR Resolution",
  description:
    "Estimate OTDR two-point spatial resolution from transmitted pulse duration and fiber group index; receiver bandwidth and dead zones can worsen it.",
  inputs: [
    {
      id: "pulseDurationS",
      kind: "number",
      label: "Optical pulse duration",
      unit: "s",
      minimum: 0,
    },
    {
      id: "groupIndex",
      kind: "number",
      label: "Fiber group index",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "spatialResolutionM",
      kind: "number",
      label: "Pulse-limited spatial resolution",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateOtdrResolution({
      pulseDurationS: input.pulseDurationS as number,
      groupIndex: input.groupIndex as number,
    }),
});
export const otdrResolutionTool = tool;
export const runOtdrResolution = tool.execute;
export default tool;
