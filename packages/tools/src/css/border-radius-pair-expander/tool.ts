import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  horizontal: readonly number[];
  vertical: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "horizontal", label: "horizontal", kind: "numberList" },
  { id: "vertical", label: "vertical", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({
    horizontal: H.quad(i.horizontal),
    vertical: H.quad(i.vertical),
  });
};
export const example = {
  input: { horizontal: [2, 4], vertical: [1] },
  output: { result: { horizontal: [2, 4, 2, 4], vertical: [1, 1, 1, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["CSS Border Radius Pair Expander", "CSS", "web development"],
    collections: ["encode-decode"],
    fields: ["CSS", "web development"],
    keywords: ["CSS", "web development"],
  },
  id: "css/border-radius-pair-expander",
  title: "CSS Border Radius Pair Expander",
  description:
    "Expand explicit nonnegative numeric horizontal/vertical border-radius shorthand lists independently in TL,TR,BR,BL order; no unit resolution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          horizontal: { type: "array", items: { type: "number" } },
          vertical: { type: "array", items: { type: "number" } },
        },
        required: ["horizontal", "vertical"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
