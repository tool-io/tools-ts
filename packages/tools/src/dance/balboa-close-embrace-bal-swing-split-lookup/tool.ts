import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly form: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "form", label: "Form", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.form,
      {
        "pure-balboa": "Close-embrace Balboa with compact step patterns.",
        "bal-swing":
          "Includes open-position/turning swing vocabulary as well as close-embrace elements.",
      },
      "form",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { form: "pure-balboa" },
  output: {
    result: { reference: "Close-embrace Balboa with compact step patterns." },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/balboa-close-embrace-bal-swing-split-lookup",
  title: "Balboa Close Embrace Bal Swing Split Lookup",
  description:
    "Bounded broad Balboa form distinction, not lineage, skill or partner-safety classification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
