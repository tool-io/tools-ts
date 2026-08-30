import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly singleAgentTargetDoses: readonly number[];
  readonly mixtureDosePairs: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly normalizedDoseSums: readonly number[];
  readonly additivityDeviations: readonly number[];
}>;
const inputFields = [
  {
    id: "singleAgentTargetDoses",
    label: "Single agent target doses",
    kind: "numberList",
  },
  { id: "mixtureDosePairs", label: "Mixture dose pairs", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.singleAgentTargetDoses.length !== 2 ||
    !input.mixtureDosePairs.length ||
    input.mixtureDosePairs.some((row) => row.length !== 2)
  )
    simpleError(
      "mixtureDosePairs",
      "Two reference effect doses and nonempty two-agent pairs required.",
    );
  input.singleAgentTargetDoses.forEach((v) =>
    positive(v, "singleAgentTargetDoses"),
  );
  input.mixtureDosePairs.forEach((row) =>
    row.forEach((v) => nonnegative(v, "mixtureDosePairs")),
  );
  const normalizedDoseSums = input.mixtureDosePairs.map(
    (row) =>
      row[0] / input.singleAgentTargetDoses[0] +
      row[1] / input.singleAgentTargetDoses[1],
  );
  return {
    normalizedDoseSums,
    additivityDeviations: normalizedDoseSums.map((v) => v - 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  singleAgentTargetDoses: [10, 20],
  mixtureDosePairs: [
    [2, 8],
    [5, 10],
  ],
} satisfies Input;
export const exampleOutput = {
  normalizedDoseSums: [0.6, 1],
  additivityDeviations: [-0.4, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/two-agent-isobologram-deviation",
  title: "Isobologram Analysis",
  description:
    "Measure geometric deviation from a two-agent Loewe isobole at a caller-fixed effect level; negative deviations alone do not establish synergy without matched effects and uncertainty.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalizedDoseSums",
      label: "Normalized dose sums",
      kind: "numberList",
    },
    {
      id: "additivityDeviations",
      label: "Additivity deviations",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      singleAgentTargetDoses: value.singleAgentTargetDoses as readonly number[],
      mixtureDosePairs:
        value.mixtureDosePairs as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
