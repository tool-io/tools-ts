import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ t: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "t", label: "t", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.unit(i.t);
  return H.finish({ value: 1 - (1 - i.t) ** 3 });
};
export const example = {
  input: { t: 0.25 },
  output: { result: { value: 0.578125 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Unit Cubic Out Easing Value", "mathematics"],
    collections: ["data", "learn"],
    fields: ["easing", "mathematics"],
    keywords: ["mathematics"],
  },
  id: "easing/unit-cubic-out-value",
  title: "Unit Cubic Out Easing Value",
  description:
    "Evaluate Unit Cubic Out Easing Value on the closed unit domain; deterministic numerical curve arithmetic without animation scheduling.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
