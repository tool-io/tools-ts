import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ classes: string; remove: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "classes", kind: "string", label: "classes" },
  { id: "remove", kind: "string", label: "remove" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const remove = H.classTokens(i.remove);
  return H.finish({
    classes: H.classTokens(i.classes)
      .filter((x) => !remove.includes(x))
      .join(" "),
  });
};
export const example = {
  input: { classes: "a b a c", remove: "b c" },
  output: { result: { classes: "a a" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "html/class-token-difference",
  title: "HTML Class Token Difference",
  description:
    "Subtract literal HTML class tokens while preserving surviving duplicates and order; CSS selector syntax and case folding are not applied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { classes: { type: "string" } },
        required: ["classes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
