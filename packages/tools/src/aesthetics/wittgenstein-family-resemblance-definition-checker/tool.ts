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
      "overlapping independently annotated traits",
      "no universally shared trait asserted",
      "comparison context independently declared",
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
  input: { observedCriterionFlags: [1, 1, 1], criterionKnownFlags: [1, 1, 1] },
  output: {
    result: {
      witnessedCriteria: [
        "overlapping independently annotated traits",
        "no universally shared trait asserted",
        "comparison context independently declared",
      ],
      knownMissingCriteria: [],
      unknownCriteria: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aesthetics/wittgenstein-family-resemblance-definition-checker",
  title: "Wittgenstein Family Resemblance Definition Checker",
  description:
    "Audit evidence of a declared family-resemblance use; not prove no essence exists. Wittgenstein, Philosophical Investigations66\u201371. Independently established criterion columns: overlapping independently annotated traits, no universally shared trait asserted, comparison context independently declared. No certification or invented missing evidence.",
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
