import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch49-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  return {
    text: pick(
      input.topic,
      {
        nominalThickness:
          "Title-specific nominal veneer thickness0.6mm=600\u00b5m. Actual product/tolerance/moisture and calibrated measurement determine stock thickness.",
        limitations:
          "Not a universal veneer-thickness specification or material strength.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "nominalThickness" },
  output: {
    result: {
      text: "Title-specific nominal veneer thickness0.6mm=600\u00b5m. Actual product/tolerance/moisture and calibrated measurement determine stock thickness.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/furnier-staerke-06mm",
  title: "Furnier St\u00e4rke 0,6mm Lookup",
  description:
    "Bounded off line reference: Named milestone dimensional/condition reference only, not fabricated universal material rule. Explicit topics nominalThickness, limitations. No full/live authority, clinical diagnosis, safe-use approval or universal individual outcome.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
