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
        abbreviation:
          "abbr title can provide expansion but tooltip access is inconsistent; provide visible expansion when needed.",
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
  input: { topic: "abbreviation" },
  output: {
    result: {
      reference:
        "abbr title can provide expansion but tooltip access is inconsistent; provide visible expansion when needed.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/abbr-title-a11y-note-lookup",
  title: "abbr title A11y Note Lookup",
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
