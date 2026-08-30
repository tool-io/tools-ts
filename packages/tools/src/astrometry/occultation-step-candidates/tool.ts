import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, fraction, aligned, ordered } from "../shared.js";

export type Input = Readonly<{
  readonly sampleTimesSeconds: readonly number[];
  readonly fluxes: readonly number[];
  readonly minimumFractionalDrop: number;
}>;
export type Output = Readonly<{
  readonly stepTimesSeconds: readonly number[];
  readonly stepCount: number;
  readonly twoStepCandidate: boolean;
}>;
export const calculate = (input: Input): Output => {
  aligned(input.sampleTimesSeconds, input.fluxes, "sampleTimesSeconds");
  ordered(input.sampleTimesSeconds, "sampleTimesSeconds");
  input.fluxes.forEach((v) => positive(v, "fluxes"));
  fraction(input.minimumFractionalDrop, "minimumFractionalDrop");
  positive(input.minimumFractionalDrop, "minimumFractionalDrop");
  const stepTimesSeconds = input.sampleTimesSeconds.filter(
    (_, i) =>
      i > 0 &&
      (input.fluxes[i - 1] - input.fluxes[i]) / input.fluxes[i - 1] >=
        input.minimumFractionalDrop,
  );
  return {
    stepTimesSeconds,
    stepCount: stepTimesSeconds.length,
    twoStepCandidate: stepTimesSeconds.length === 2,
  };
};
export const exampleInput = {
  sampleTimesSeconds: [0, 1, 2, 3, 4],
  fluxes: [100, 100, 70, 70, 40],
  minimumFractionalDrop: 0.2,
} satisfies Input;
export const exampleOutput = {
  stepTimesSeconds: [2, 4],
  stepCount: 2,
  twoStepCandidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/occultation-step-candidates",
  title: "Occultation Step Candidates",
  description:
    "Find discrete sampled flux-drop candidates at a supplied threshold; two steps are not by themselves evidence for an occulted binary.",
  inputs: [
    {
      id: "sampleTimesSeconds",
      label: "Sample times seconds",
      kind: "numberList",
    },
    { id: "fluxes", label: "Fluxes", kind: "numberList" },
    {
      id: "minimumFractionalDrop",
      label: "Minimum fractional drop",
      kind: "number",
    },
  ],
  outputs: [
    { id: "stepTimesSeconds", label: "Step times seconds", kind: "numberList" },
    { id: "stepCount", label: "Step count", kind: "number" },
    { id: "twoStepCandidate", label: "Two step candidate", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sampleTimesSeconds: value.sampleTimesSeconds as readonly number[],
      fluxes: value.fluxes as readonly number[],
      minimumFractionalDrop: value.minimumFractionalDrop as number,
    }),
});
export const run = tool.execute;
export default tool;
