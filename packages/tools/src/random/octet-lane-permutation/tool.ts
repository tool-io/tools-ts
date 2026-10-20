import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  bytes: readonly number[];
  laneWidth: number;
  seed: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bytes", label: "bytes", kind: "numberList" },
  { id: "laneWidth", label: "laneWidth", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.bytes(i.bytes);
  H.int(i.laneWidth, 1, 128);
  H.check(
    i.bytes.length % i.laneWidth === 0 && i.bytes.length / i.laneWidth > 1,
  );
  const order = H.shuffle(
    Array.from({ length: i.bytes.length / i.laneWidth }, (_, j) => j),
    random,
  );
  return H.finish({
    seed: i.seed,
    laneOrder: order,
    bytes: order.flatMap((j) =>
      i.bytes.slice(j * i.laneWidth, (j + 1) * i.laneWidth),
    ),
  });
};
export const example = {
  input: { bytes: [0, 1, 2, 3], laneWidth: 2, seed: "batch56" },
  output: {
    result: { seed: "batch56", laneOrder: [0, 1], bytes: [0, 1, 2, 3] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Octet Lane Permutation", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/octet-lane-permutation",
  title: "Random Octet Lane Permutation",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Uniformly permute fixed-width octet lanes as indivisible blocks, preserving intra-lane byte order; not endian conversion or arbitrary byte shuffling.",
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
          laneOrder: { type: "array", items: { type: "number" } },
          bytes: { type: "array", items: { type: "number" } },
        },
        required: ["seed", "laneOrder", "bytes"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
