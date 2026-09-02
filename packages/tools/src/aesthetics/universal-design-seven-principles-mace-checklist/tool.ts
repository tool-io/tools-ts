import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  annotatedChecklist,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly observedCriterionFlags: readonly number[];
  readonly criterionKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedCriterionFlags",
    label: "Observed criterion flags",
    kind: "numberList",
  },
  {
    id: "criterionKnownFlags",
    label: "Criterion known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return annotatedChecklist(
    [
      "equitable use",
      "flexibility in use",
      "simple and intuitive use",
      "perceptible information",
      "tolerance for error",
      "low physical effort",
      "size and space for approach and use",
    ],
    input.observedCriterionFlags,
    input.criterionKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedCriterionFlags: [1, 1, 1, 1, 1, 1, 1],
    criterionKnownFlags: [1, 1, 1, 1, 1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "equitable use",
        "flexibility in use",
        "simple and intuitive use",
        "perceptible information",
        "tolerance for error",
        "low physical effort",
        "size and space for approach and use",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/universal-design-seven-principles-mace-checklist",
  title: "Universal Design Seven Principles Mace Checklist",
  description:
    "Record independently assessed seven-principle Universal Design evidence. Center for Universal Design 1997. Unknown observations are not compliance/accessibility certification. Independently established criterion columns: equitable use, flexibility in use, simple and intuitive use, perceptible information, tolerance for error, low physical effort, size and space for approach and use. No certification or invented missing evidence.",
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
