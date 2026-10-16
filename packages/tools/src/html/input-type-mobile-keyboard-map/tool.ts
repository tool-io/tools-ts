import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly inputType: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "inputType", label: "Input type", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.inputType,
      {
        text: "General text keyboard hint; use inputmode for explicit hints.",
        email: "Email-oriented keyboard hint.",
        url: "URL-oriented keyboard hint.",
        tel: "Telephone-oriented keyboard hint, no built-in telephone format validation.",
        number:
          "Numeric input UI; use inputmode=decimal/numeric when appropriate for text identifiers.",
        search: "Search action/text keyboard hint.",
        password: "Masked text input, keyboard behavior browser-dependent.",
      },
      "inputType",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { inputType: "tel" },
  output: {
    result: {
      reference:
        "Telephone-oriented keyboard hint, no built-in telephone format validation.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/input-type-mobile-keyboard-map",
  title: "Input Type Mobile Keyboard Map",
  description:
    "Bounded common mobile input-type keyboard hints, not device-specific layout guarantees.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { reference: { type: "string" } },
        required: ["reference"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
