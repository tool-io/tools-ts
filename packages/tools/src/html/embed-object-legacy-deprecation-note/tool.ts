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
        elements:
          "embed and object remain HTML elements; obsolete plug-in technologies are not supported merely because these tags exist. Use purpose-specific modern alternatives where appropriate.",
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
  input: { topic: "elements" },
  output: {
    result: {
      reference:
        "embed and object remain HTML elements; obsolete plug-in technologies are not supported merely because these tags exist. Use purpose-specific modern alternatives where appropriate.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/embed-object-legacy-deprecation-note",
  title: "embed/object Legacy Deprecation Note",
  description:
    "Bounded HTML feature/convention note; no full document audit or live browser compatibility determination.",
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
