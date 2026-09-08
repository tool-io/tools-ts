import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedColorIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedColorIds",
    label: "Independently annotated color ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    !input.independentlyAnnotatedColorIds.length ||
    input.independentlyAnnotatedColorIds.some((v) => !v.trim())
  )
    simpleError(
      "colors",
      "Nonempty independently identified exact colour IDs.",
    );
  const required = ["red", "yellow", "green"];
  return {
    containsConventionalSet: required.every((v) =>
      input.independentlyAnnotatedColorIds.includes(v),
    ),
    missingConventionalColors: required.filter(
      (v) => !input.independentlyAnnotatedColorIds.includes(v),
    ),
    additionalObservedColors: [
      ...new Set(
        input.independentlyAnnotatedColorIds.filter(
          (v) => !required.includes(v),
        ),
      ),
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyAnnotatedColorIds: ["red", "yellow", "green"] },
  output: {
    result: {
      containsConventionalSet: true,
      missingConventionalColors: [],
      additionalObservedColors: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/pan-african-set-checker",
  title: "Pan-African Color Set Membership Checker",
  description:
    "Check conventional Ethiopian red/yellow/green Pan-African palette only; red/black/green is a distinct tradition. Colour membership alone establishes no political, ethnic, national or family identity.",
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
