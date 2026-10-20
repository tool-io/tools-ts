import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ length: number; seed: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "length", label: "length", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.length, 2, 128);
  const cut = H.randint(1, i.length - 1, random);
  return H.finish({
    seed: i.seed,
    cut,
    left: [0, cut],
    right: [cut, i.length],
  });
};
export const example = {
  input: { length: 5, seed: "batch56" },
  output: { result: { seed: "batch56", cut: 3, left: [0, 3], right: [3, 5] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Single Nonempty Split", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/single-nonempty-split",
  title: "Random Single Nonempty Split",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose one uniform internal cut between nonempty pieces of an index domain, with no list-value interpretation.",
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
          seed: { type: "string" },
          cut: { type: "number" },
          left: { type: "array", items: { type: "number" } },
          right: { type: "array", items: { type: "number" } },
        },
        required: ["seed", "cut", "left", "right"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
