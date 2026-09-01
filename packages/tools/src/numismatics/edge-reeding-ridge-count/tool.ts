import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  strictlyIncreasing,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedDistinctRidgeAnglesDegrees: readonly number[];
  readonly callerEntireCircumferenceSurveyed: boolean;
}>;
export type Output = Readonly<{
  readonly observedDistinctRidgeCount: number;
  readonly verifiedFullCircumferenceRidgeCount: number;
  readonly observedConsecutiveRidgeAngularGapsDegrees: readonly number[];
  readonly fullCircumferenceClosingGapDegrees: number;
}>;
const inputFields = [
  {
    id: "observedDistinctRidgeAnglesDegrees",
    label: "Observed distinct ridge angles degrees",
    kind: "numberList",
  },
  {
    id: "callerEntireCircumferenceSurveyed",
    label: "Caller entire circumference surveyed",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  strictlyIncreasing(input.observedDistinctRidgeAnglesDegrees, "ridges", 1);
  if (input.observedDistinctRidgeAnglesDegrees.some((v) => v < 0 || v >= 360))
    simpleError(
      "ridges",
      "Distinct ordered observed angular ridge positions in [0,360) required.",
    );
  const angles = input.observedDistinctRidgeAnglesDegrees;
  return {
    observedDistinctRidgeCount: angles.length,
    verifiedFullCircumferenceRidgeCount: input.callerEntireCircumferenceSurveyed
      ? angles.length
      : -1,
    observedConsecutiveRidgeAngularGapsDegrees: angles
      .slice(1)
      .map((v, i) => v - angles[i]),
    fullCircumferenceClosingGapDegrees: input.callerEntireCircumferenceSurveyed
      ? 360 - angles.at(-1)! + angles[0]
      : -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDistinctRidgeAnglesDegrees: [0, 90, 180, 270],
  callerEntireCircumferenceSurveyed: true,
} satisfies Input;
export const exampleOutput = {
  observedDistinctRidgeCount: 4,
  verifiedFullCircumferenceRidgeCount: 4,
  observedConsecutiveRidgeAngularGapsDegrees: [90, 90, 90],
  fullCircumferenceClosingGapDegrees: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/edge-reeding-ridge-count",
  title: "Edge Reeding Ridge Count Tool",
  description:
    "Inventory actual distinct ridge observations and angular gaps, full-edge count only with caller complete survey evidence; incomplete count/closing gap unavailable −1, no image ridge detection or issue authentication.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDistinctRidgeCount",
      label: "Observed distinct ridge count",
      kind: "number",
    },
    {
      id: "verifiedFullCircumferenceRidgeCount",
      label: "Verified full circumference ridge count",
      kind: "number",
    },
    {
      id: "observedConsecutiveRidgeAngularGapsDegrees",
      label: "Observed consecutive ridge angular gaps degrees",
      kind: "numberList",
    },
    {
      id: "fullCircumferenceClosingGapDegrees",
      label: "Full circumference closing gap degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDistinctRidgeAnglesDegrees:
        value.observedDistinctRidgeAnglesDegrees as readonly number[],
      callerEntireCircumferenceSurveyed:
        value.callerEntireCircumferenceSurveyed as boolean,
    }),
});
export const run = tool.execute;
export default tool;
