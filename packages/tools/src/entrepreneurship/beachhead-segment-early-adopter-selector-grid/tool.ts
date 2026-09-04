import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  unique,
  sum,
  shape,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerSegmentIds: readonly string[];
  readonly callerEvidenceCriterionScores: readonly (readonly number[])[];
  readonly callerCriterionWeights: readonly number[];
  readonly knownCriterionFlags: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly knownWeightedScores: readonly number[];
  readonly unknownCriterionCounts: readonly number[];
}>;
const inputFields = [
  { id: "callerSegmentIds", label: "Caller segment ids", kind: "stringList" },
  {
    id: "callerEvidenceCriterionScores",
    label: "Caller evidence criterion scores",
    kind: "matrix",
  },
  {
    id: "callerCriterionWeights",
    label: "Caller criterion weights",
    kind: "numberList",
  },
  { id: "knownCriterionFlags", label: "Known criterion flags", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerCriterionWeights.forEach((v) =>
    nonnegative(v, "callerCriterionWeights"),
  );
  aligned(
    input.callerSegmentIds,
    input.callerEvidenceCriterionScores,
    "callerSegmentIds",
  );
  aligned(
    input.callerSegmentIds,
    input.knownCriterionFlags,
    "callerSegmentIds",
  );
  unique(input.callerSegmentIds, "segments");
  if (
    shape(input.callerEvidenceCriterionScores, "criteria") !==
      input.callerCriterionWeights.length ||
    shape(input.knownCriterionFlags, "known") !==
      input.callerCriterionWeights.length
  )
    simpleError("shape", "Matched criteria and independently known flags.");
  input.knownCriterionFlags.forEach((r) => binary(r, "known"));
  return {
    knownWeightedScores: input.callerEvidenceCriterionScores.map((r, i) =>
      sum(
        r.map((v, j) =>
          input.knownCriterionFlags[i][j]
            ? v * input.callerCriterionWeights[j]
            : 0,
        ),
      ),
    ),
    unknownCriterionCounts: input.knownCriterionFlags.map(
      (r) => r.filter((v) => !v).length,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSegmentIds: ["a", "b"],
  callerEvidenceCriterionScores: [
    [2, 1],
    [1, 2],
  ],
  callerCriterionWeights: [2, 1],
  knownCriterionFlags: [
    [1, 1],
    [1, 0],
  ],
} satisfies Input;
export const exampleOutput = {
  knownWeightedScores: [5, 2],
  unknownCriterionCounts: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/beachhead-segment-early-adopter-selector-grid",
  title: "Beachhead Segment Early Adopter Selector Grid",
  description:
    "Caller beachhead-segment evidence grid weighted scores with missing evidence counts; no assumed early-adopter identity or rank of unknown as proven poor. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownWeightedScores",
      label: "Known weighted scores",
      kind: "numberList",
    },
    {
      id: "unknownCriterionCounts",
      label: "Unknown criterion counts",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSegmentIds: value.callerSegmentIds as readonly string[],
      callerEvidenceCriterionScores:
        value.callerEvidenceCriterionScores as readonly (readonly number[])[],
      callerCriterionWeights: value.callerCriterionWeights as readonly number[],
      knownCriterionFlags:
        value.knownCriterionFlags as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
