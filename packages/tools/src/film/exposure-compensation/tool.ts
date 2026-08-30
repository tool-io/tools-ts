import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ExposureCompensationInput = Readonly<{
  readonly currentEv: number;
  readonly desiredEv: number;
}>;
export type ExposureCompensationOutput = Readonly<{
  readonly compensationStops: number;
}>;

export const calculateExposureCompensation = (
  x: ExposureCompensationInput,
): ExposureCompensationOutput => {
  if (!Number.isFinite(x.currentEv))
    simpleError("currentEv", "Provide a finite number.");
  if (!Number.isFinite(x.desiredEv))
    simpleError("desiredEv", "Provide a finite number.");
  const compensationStops = x.currentEv - x.desiredEv;
  if (!Number.isFinite(compensationStops))
    simpleError(
      "compensationStops",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    compensationStops: Object.is(compensationStops, -0) ? 0 : compensationStops,
  };
};

export const example = {
  input: { currentEv: 10, desiredEv: 9 },
  output: { compensationStops: 1 },
} satisfies ToolExample<ExposureCompensationInput, ExposureCompensationOutput>;

export const tool = createSimpleTool({
  id: "film/exposure-compensation",
  title: "Exposure Compensation",
  description:
    "Exposure-setting change in stops from current EV to desired EV; positive compensation means more light and therefore a lower desired EV.",
  inputs: [
    { id: "currentEv", kind: "number", label: "Current Ev", unit: "EV" },
    { id: "desiredEv", kind: "number", label: "Desired Ev", unit: "EV" },
  ],
  outputs: [
    {
      id: "compensationStops",
      kind: "number",
      label: "Compensation Stops",
      unit: "stops",
    },
  ],
  calculate: (input) =>
    calculateExposureCompensation({
      currentEv: input.currentEv as number,
      desiredEv: input.desiredEv as number,
    }),
});
export const exposureCompensationTool = tool;
export const runExposureCompensation = tool.execute;
export default tool;
