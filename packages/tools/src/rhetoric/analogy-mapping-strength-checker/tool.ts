import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, weightedCoverage } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyDeclaredMappingWeights: readonly number[];
  readonly independentlyWitnessedMappingFlags: readonly number[];
  readonly mappingKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyDeclaredMappingWeights",
    label: "Independently declared mapping weights",
    kind: "numberList",
  },
  {
    id: "independentlyWitnessedMappingFlags",
    label: "Independently witnessed mapping flags",
    kind: "numberList",
  },
  { id: "mappingKnownFlags", label: "Mapping known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return weightedCoverage(
    input.independentlyDeclaredMappingWeights,
    input.independentlyWitnessedMappingFlags,
    input.mappingKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyDeclaredMappingWeights: [2, 1],
    independentlyWitnessedMappingFlags: [1, 0],
    mappingKnownFlags: [1, 0],
  },
  output: {
    result: {
      witnessedFraction: 0.6666666666666666,
      unknownWeightFraction: 0.3333333333333333,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/analogy-mapping-strength-checker",
  title: "Analogy Mapping Strength Checker",
  description:
    "Audit independently aligned analogy correspondences under caller weights, retaining unknown weight; mapping coverage is not argument soundness.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
