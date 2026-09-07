import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedRoleLabels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedRoleLabels",
    label: "Independently annotated role labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.independentlyAnnotatedRoleLabels.length !== 4 ||
    input.independentlyAnnotatedRoleLabels.some((v) => !v.trim())
  )
    simpleError("roles", "Exactly four independently established role labels.");
  const [a, b, c, d] = input.independentlyAnnotatedRoleLabels;
  return { matchesAbbaRolePattern: a === d && b === c && a !== b };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyAnnotatedRoleLabels: ["A", "B", "B", "A"] },
  output: { result: { matchesAbbaRolePattern: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/chiasmus-crossed-abba-structure-detector",
  title: "Chiasmus Crossed ABBA Structure Detector",
  description:
    "Audit an independently annotated distinct-role ABBA chiasmus pattern, not automatic semantic parsing.",
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
