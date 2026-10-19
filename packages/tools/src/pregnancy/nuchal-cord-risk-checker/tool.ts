import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  annotatedChecklist,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyWitnessedCriterionFlags: readonly number[];
  readonly criterionKnownFlags: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyWitnessedCriterionFlags",
    label: "Independently witnessed criterion flags",
    kind: "numberList",
  },
  {
    id: "criterionKnownFlags",
    label: "Criterion known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return annotatedChecklist(
    [
      "actual cord finding independently assessed",
      "actual fetal assessment independently reviewed",
      "clinically relevant context independently established",
      "qualified clinical interpretation recorded",
    ],
    input.independentlyWitnessedCriterionFlags,
    input.criterionKnownFlags,
  );
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyWitnessedCriterionFlags: [1, 1, 1, 1],
    criterionKnownFlags: [1, 1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "actual cord finding independently assessed",
        "actual fetal assessment independently reviewed",
        "clinically relevant context independently established",
        "qualified clinical interpretation recorded",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/nuchal-cord-risk-checker",
  title: "Nuchal Cord Risk Checker",
  description:
    "Nuchal-cord evidence review, not infer a universal cord-risk probability or delivery recommendation from a loop count. Independently established criterion columns: actual cord finding independently assessed, actual fetal assessment independently reviewed, clinically relevant context independently established, qualified clinical interpretation recorded. Unknown/missing evidence retained. Not readiness, eligibility, diagnosis, treatment, safety or compliance approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
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
