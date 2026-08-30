import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OtdrDistanceInput = Readonly<{
  readonly roundTripDelayS: number;
  readonly groupIndex: number;
}>;
export type OtdrDistanceOutput = Readonly<{
  readonly distanceM: number;
}>;

export const calculateOtdrDistance = (
  x: OtdrDistanceInput,
): OtdrDistanceOutput => {
  if (!Number.isFinite(x.roundTripDelayS) || x.roundTripDelayS < 0)
    simpleError("roundTripDelayS", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.groupIndex) || x.groupIndex < 1)
    simpleError("groupIndex", "Provide a finite number at least 1.");
  if (!(x.groupIndex >= 1))
    simpleError("groupIndex", "Group index must be at least one.");
  const distanceM = (299792458 * x.roundTripDelayS) / (2 * x.groupIndex);
  if (!Number.isFinite(distanceM))
    simpleError("distanceM", "The inputs produce an invalid result.");
  return { distanceM: Object.is(distanceM, -0) ? 0 : distanceM };
};

export const example = {
  input: { roundTripDelayS: 0.00001, groupIndex: 1.5 },
  output: { distanceM: 999.3081933333334 },
} satisfies ToolExample<OtdrDistanceInput, OtdrDistanceOutput>;

export const tool = createSimpleTool({
  id: "electronics/otdr-distance",
  title: "OTDR Distance",
  description:
    "Convert optical time-domain reflectometer round-trip delay to one-way fiber distance using its group refractive index.",
  inputs: [
    {
      id: "roundTripDelayS",
      kind: "number",
      label: "Round-trip delay",
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
      id: "distanceM",
      kind: "number",
      label: "One-way fiber distance",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateOtdrDistance({
      roundTripDelayS: input.roundTripDelayS as number,
      groupIndex: input.groupIndex as number,
    }),
});
export const otdrDistanceTool = tool;
export const runOtdrDistance = tool.execute;
export default tool;
