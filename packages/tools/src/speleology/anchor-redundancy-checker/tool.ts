import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  annotatedChecklist,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyWitnessedCriterionFlags: readonly number[];
  readonly criterionEvidenceKnownFlags: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyWitnessedCriterionFlags",
    label: "Independently witnessed criterion flags",
    kind: "numberList",
  },
  {
    id: "criterionEvidenceKnownFlags",
    label: "Criterion evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return annotatedChecklist(
    [
      "independently qualified anchor one evidence",
      "independently qualified anchor two evidence",
      "independent load-path assessment evidence",
    ],
    input.independentlyWitnessedCriterionFlags,
    input.criterionEvidenceKnownFlags,
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyWitnessedCriterionFlags: [1, 1, 1],
    criterionEvidenceKnownFlags: [1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "independently qualified anchor one evidence",
        "independently qualified anchor two evidence",
        "independent load-path assessment evidence",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/anchor-redundancy-checker",
  title: "Anchor Redundancy Count Checker",
  description:
    "Anchor evidence inventory only; count alone does not establish redundancy, capacity or shared-failure independence. Actual independently witnessed criterion columns: independently qualified anchor one evidence, independently qualified anchor two evidence, independent load-path assessment evidence. Unknowns retained; not readiness, authenticity, legality, diagnosis or safety certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          witnessedCriteria: { type: "array", items: { type: "string" } },
          knownMissingCriteria: { type: "array", items: { type: "string" } },
          unknownCriteria: { type: "array", items: { type: "string" } },
        },
        required: [
          "witnessedCriteria",
          "knownMissingCriteria",
          "unknownCriteria",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
