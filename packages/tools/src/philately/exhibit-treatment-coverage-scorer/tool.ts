import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly requiredTopicWeights: readonly number[];
  readonly coveredTopicFlags: readonly number[];
  readonly coverageKnownFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly witnessedCoveragePercent: number;
  readonly unknownWeightPercent: number;
}>;
const inputFields = [
  {
    id: "requiredTopicWeights",
    label: "Required topic weights",
    kind: "numberList",
  },
  { id: "coveredTopicFlags", label: "Covered topic flags", kind: "numberList" },
  {
    id: "coverageKnownFlags",
    label: "Coverage known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.requiredTopicWeights.forEach((v) =>
    nonnegative(v, "requiredTopicWeights"),
  );
  binary(input.coveredTopicFlags, "coveredTopicFlags");
  binary(input.coverageKnownFlags, "coverageKnownFlags");
  aligned(
    input.requiredTopicWeights,
    input.coveredTopicFlags,
    "requiredTopicWeights",
  );
  aligned(
    input.requiredTopicWeights,
    input.coverageKnownFlags,
    "requiredTopicWeights",
  );
  const total = positive(sum(input.requiredTopicWeights), "total topicweight");
  return {
    witnessedCoveragePercent:
      (100 *
        sum(
          input.requiredTopicWeights.map(
            (v, i) =>
              v * input.coveredTopicFlags[i] * input.coverageKnownFlags[i],
          ),
        )) /
      total,
    unknownWeightPercent:
      (100 *
        sum(
          input.requiredTopicWeights.map(
            (v, i) => v * (1 - input.coverageKnownFlags[i]),
          ),
        )) /
      total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requiredTopicWeights: [2, 1, 1],
  coveredTopicFlags: [1, 0, 1],
  coverageKnownFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  witnessedCoveragePercent: 50,
  unknownWeightPercent: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/exhibit-treatment-coverage-scorer",
  title: "Exhibit Treatment Plan Coverage Percent Scorer",
  description:
    "Audit weighted exhibit treatment-plan topic coverage while retaining uninspected weight; coverage is not scholarly quality. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "witnessedCoveragePercent",
      label: "Witnessed coverage percent",
      kind: "number",
    },
    {
      id: "unknownWeightPercent",
      label: "Unknown weight percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      requiredTopicWeights: value.requiredTopicWeights as readonly number[],
      coveredTopicFlags: value.coveredTopicFlags as readonly number[],
      coverageKnownFlags: value.coverageKnownFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
