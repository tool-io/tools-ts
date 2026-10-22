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
      "left dimension evidence present",
      "right dimension evidence present",
      "up dimension evidence present",
      "down dimension evidence present",
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
    independentlyWitnessedCriterionFlags: [1, 1, 1, 1],
    criterionEvidenceKnownFlags: [1, 1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "left dimension evidence present",
        "right dimension evidence present",
        "up dimension evidence present",
        "down dimension evidence present",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/lrud-completeness-checker",
  title: "LRUD Passage Sketch Dimension Completeness Checker",
  description:
    "Actual LRUDannotated dimensional completeness; not automatically derive surveyed passage area or verify measurements. Actual independently witnessed criterion columns: left dimension evidence present, right dimension evidence present, up dimension evidence present, down dimension evidence present. Unknowns retained; not readiness, authenticity, legality, diagnosis or safety certification.",
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
