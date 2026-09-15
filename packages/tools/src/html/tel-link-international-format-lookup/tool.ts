import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{ readonly e164Digits: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "e164Digits", label: "E164 digits", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  if (!/^[1-9]\d{1,14}$(?![\s\S])/.test(i.e164Digits))
    simpleError(
      "number",
      "2–15 international digits without +; actual country/assignment external.",
    );
  return { telUri: "tel:+" + i.e164Digits, assignedNumberVerified: false };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { e164Digits: "12025550123" },
  output: {
    result: { telUri: "tel:+12025550123", assignedNumberVerified: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/tel-link-international-format-lookup",
  title: "tel: Link International Format",
  description:
    "Format bounded E.164-like digit shape as global tel URI; no country-code, number assignment or caller identity validation.",
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
