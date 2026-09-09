import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, mean } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredSaccadeEndpointsDegrees: readonly number[];
  readonly matchedRememberedTargetAnglesDegrees: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredSaccadeEndpointsDegrees",
    label: "Independently measured saccade endpoints degrees",
    kind: "numberList",
  },
  {
    id: "matchedRememberedTargetAnglesDegrees",
    label: "Matched remembered target angles degrees",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyMeasuredSaccadeEndpointsDegrees,
    input.matchedRememberedTargetAnglesDegrees,
    "trials",
  );
  const e = input.independentlyMeasuredSaccadeEndpointsDegrees.map(
    (v, i) => v - input.matchedRememberedTargetAnglesDegrees[i],
  );
  return {
    signedMemoryGuidedEndpointErrorsDegrees: e,
    observedMeanAbsoluteErrorDegrees: mean(e.map((v) => Math.abs(v))),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredSaccadeEndpointsDegrees: [9, 12],
    matchedRememberedTargetAnglesDegrees: [10, 10],
  },
  output: {
    result: {
      signedMemoryGuidedEndpointErrorsDegrees: [-1, 2],
      observedMeanAbsoluteErrorDegrees: 1.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/memory-guided-saccade-error",
  title: "Memory Guided Saccade Error Calculator",
  description:
    "Actual matched memory-guided saccade endpoint minus remembered target angular errors; signed discrepancies retained. Task, coordinate and calibration external, not memory diagnosis or generic eye tracking accuracy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
