import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
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
      "opening and ending bounded",
      "independently annotated repetition",
      "independently annotated contrast",
      "independently annotated single-strand action",
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
    observedCriterionFlags: [1, 1, 1, 1],
    criterionKnownFlags: [1, 1, 1, 1],
  },
  output: {
    result: {
      witnessedCriteria: [
        "opening and ending bounded",
        "independently annotated repetition",
        "independently annotated contrast",
        "independently annotated single-strand action",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "folklore/olrik-epic-laws-conformity-checklist",
  title: "Olrik Epic Laws Conformity Checklist",
  description:
    "Audit a declared four-criterion subset of Olriks epic laws, not every law or universal conformity. Caller annotates original narrative and chosen edition. Independently established criterion columns: opening and ending bounded, independently annotated repetition, independently annotated contrast, independently annotated single-strand action. No certification or invented missing evidence.",
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
