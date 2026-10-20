import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ width: number; ones: number; seed: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "width", label: "width", kind: "integer" },
  { id: "ones", label: "ones", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.width, 1, 128);
  H.int(i.ones, 1, i.width);
  const positions = H.choosePositions(i.width, i.ones, random).sort(
    (a, b) => a - b,
  );
  return H.finish({
    seed: i.seed,
    positions,
    mask: Array.from({ length: i.width }, (_, j) =>
      positions.includes(j) ? "1" : "0",
    ).join(""),
  });
};
export const example = {
  input: { width: 4, ones: 2, seed: "batch56" },
  output: { result: { seed: "batch56", positions: [2, 3], mask: "0011" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Random Fixed Popcount Mask", "random generation"],
    collections: ["data", "learn"],
    fields: ["random", "random generation"],
    keywords: ["random generation"],
  },
  id: "random/fixed-popcount-mask",
  title: "Random Fixed Popcount Mask",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose a uniform fixed-cardinality bit-position subset without replacement, returning ascending selected positions; no arbitrary rejection loop.",
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
          positions: { type: "array", items: { type: "number" } },
          mask: { type: "string" },
        },
        required: ["seed", "positions", "mask"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
