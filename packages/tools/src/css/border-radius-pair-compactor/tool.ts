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
    horizontal: H.compactQuad(i.horizontal),
    vertical: H.compactQuad(i.vertical),
  });
};
export const example = {
  input: { horizontal: [2, 4, 2, 4], vertical: [1, 1, 1, 1] },
  output: { result: { horizontal: [2, 4], vertical: [1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["CSS Border Radius Pair Compactor", "CSS", "web development"],
    collections: ["encode-decode"],
    fields: ["CSS", "web development"],
    keywords: ["CSS", "web development"],
  },
  id: "css/border-radius-pair-compactor",
  title: "CSS Border Radius Pair Compactor",
  description:
    "Compact resolved four-corner numeric horizontal and vertical radius lists to their shortest 1\u20134 value shorthands; no units or slash parsing.",
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
