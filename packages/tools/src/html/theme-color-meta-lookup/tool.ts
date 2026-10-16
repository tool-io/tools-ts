import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  return {
    reference: pick(
      i.topic,
      {
        syntax:
          '<meta name="theme-color" content="#rrggbb"> supplies a suggested browser UI color.',
        media:
          "A media attribute can select theme-color hints for different conditions.",
        limitations:
          "Support, contrast adjustment and browser chrome behavior vary; it is not a page background declaration.",
      },
      "topic",
    ),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { topic: "syntax" },
  output: {
    result: {
      reference:
        '<meta name="theme-color" content="#rrggbb"> supplies a suggested browser UI color.',
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/theme-color-meta-lookup",
  title: "theme-color Meta Lookup",
  description:
    "Bounded HTML theme-color metadata reference; not a browser compatibility guarantee.",
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
