import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BellowsExposureCompensationInput = Readonly<{
  readonly exposureFactor: number;
}>;
export type BellowsExposureCompensationOutput = Readonly<{
  readonly additionalStops: number;
}>;

export const calculateBellowsExposureCompensation = (
  x: BellowsExposureCompensationInput,
): BellowsExposureCompensationOutput => {
  if (!Number.isFinite(x.exposureFactor) || x.exposureFactor < 1)
    simpleError("exposureFactor", "Provide a finite number at least 1.");
  const additionalStops = Math.log2(x.exposureFactor);
  if (!Number.isFinite(additionalStops))
    simpleError(
      "additionalStops",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    additionalStops: Object.is(additionalStops, -0) ? 0 : additionalStops,
  };
};

export const example = {
  input: { exposureFactor: 4 },
  output: { additionalStops: 2 },
} satisfies ToolExample<
  BellowsExposureCompensationInput,
  BellowsExposureCompensationOutput
>;

export const tool = createSimpleTool({
  id: "film/bellows-exposure-compensation",
  title: "Bellows Exposure Compensation",
  description:
    "Additional exposure in stops from a measured bellows exposure factor: log₂(factor).",
  inputs: [
    {
      id: "exposureFactor",
      kind: "number",
      label: "Exposure Factor",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "additionalStops",
      kind: "number",
      label: "Additional Stops",
      unit: "stops",
    },
  ],
  calculate: (input) =>
    calculateBellowsExposureCompensation({
      exposureFactor: input.exposureFactor as number,
    }),
});
export const bellowsExposureCompensationTool = tool;
export const runBellowsExposureCompensation = tool.execute;
export default tool;
