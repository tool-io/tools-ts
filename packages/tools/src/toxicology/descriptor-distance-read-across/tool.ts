import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly targetDescriptors: readonly number[];
  readonly analogDescriptors: readonly (readonly number[])[];
  readonly descriptorScales: readonly number[];
  readonly analogEndpoints: readonly number[];
  readonly distancePower: number;
}>;
export type Output = Readonly<{
  readonly standardizedDistances: readonly number[];
  readonly normalizedAnalogWeights: readonly number[];
  readonly predictedEndpoint: number;
  readonly exactMatchFound: boolean;
}>;
const inputFields = [
  { id: "targetDescriptors", label: "Target descriptors", kind: "numberList" },
  { id: "analogDescriptors", label: "Analog descriptors", kind: "matrix" },
  { id: "descriptorScales", label: "Descriptor scales", kind: "numberList" },
  { id: "analogEndpoints", label: "Analog endpoints", kind: "numberList" },
  { id: "distancePower", label: "Distance power", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.targetDescriptors, input.descriptorScales, "targetDescriptors");
  aligned(input.analogDescriptors, input.analogEndpoints, "analogDescriptors");
  input.descriptorScales.forEach((v) => positive(v, "descriptorScales"));
  positive(input.distancePower, "distancePower");
  if (
    input.analogDescriptors.some(
      (row) => row.length !== input.targetDescriptors.length,
    )
  )
    simpleError("analogDescriptors", "Matched descriptor vectors required.");
  const standardizedDistances = input.analogDescriptors.map((row) =>
      Math.hypot(
        ...row.map(
          (v, i) =>
            (v - input.targetDescriptors[i]) / input.descriptorScales[i],
        ),
      ),
    ),
    matches = standardizedDistances
      .map((v, i) => (v === 0 ? i : -1))
      .filter((v) => v >= 0),
    exactMatchFound = matches.length > 0,
    minimum = Math.min(...standardizedDistances),
    weights = standardizedDistances.map((v, i) =>
      exactMatchFound
        ? matches.includes(i)
          ? 1
          : 0
        : (minimum / v) ** input.distancePower,
    ),
    sum = positive(
      weights.reduce((a, b) => a + b, 0),
      "distancePower",
    ),
    normalizedAnalogWeights = weights.map((v) => v / sum);
  return {
    standardizedDistances,
    normalizedAnalogWeights,
    predictedEndpoint: normalizedAnalogWeights.reduce(
      (s, v, i) => s + v * input.analogEndpoints[i],
      0,
    ),
    exactMatchFound,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetDescriptors: [0, 0],
  analogDescriptors: [
    [1, 0],
    [0, 2],
  ],
  descriptorScales: [1, 1],
  analogEndpoints: [10, 20],
  distancePower: 2,
} satisfies Input;
export const exampleOutput = {
  standardizedDistances: [1, 2],
  normalizedAnalogWeights: [0.8, 0.2],
  predictedEndpoint: 12,
  exactMatchFound: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/descriptor-distance-read-across",
  title: "Read-Across Analog",
  description:
    "Estimate an analog endpoint by caller-scaled descriptor distances and inverse-distance weights; exact descriptor matches are averaged, and applicability/mechanistic similarity are not inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "standardizedDistances",
      label: "Standardized distances",
      kind: "numberList",
    },
    {
      id: "normalizedAnalogWeights",
      label: "Normalized analog weights",
      kind: "numberList",
    },
    { id: "predictedEndpoint", label: "Predicted endpoint", kind: "number" },
    { id: "exactMatchFound", label: "Exact match found", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      targetDescriptors: value.targetDescriptors as readonly number[],
      analogDescriptors:
        value.analogDescriptors as readonly (readonly number[])[],
      descriptorScales: value.descriptorScales as readonly number[],
      analogEndpoints: value.analogEndpoints as readonly number[],
      distancePower: value.distancePower as number,
    }),
});
export const run = tool.execute;
export default tool;
