import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { hyperLogLog } from "../hash-sketch.js";

export const example = {
  input: { items: ["a", "b", "a"], precision: 8 },
  output: { estimate: 2.007853430022625, registers: 256 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;
export const tool = createSimpleTool({
  id: "data-structure/hyperloglog",
  title: "HyperLogLog Cardinality Estimator",
  description:
    "Estimate the number of distinct strings with a fixed-size HyperLogLog sketch. The estimate is probabilistic and may differ from the exact count.",
  inputs: [
    { id: "items", kind: "stringList", label: "items" },
    {
      id: "precision",
      kind: "integer",
      label: "precision",
      minimum: 4,
      maximum: 16,
    },
  ],
  outputs: [
    { id: "estimate", kind: "number", label: "estimate" },
    { id: "registers", kind: "integer", label: "registers" },
  ],
  calculate: (input) =>
    hyperLogLog(input.items as string[], input.precision as number),
});
export type HyperloglogInput = Readonly<typeof example.input>;
export type HyperloglogOutput = Readonly<typeof example.output>;
export const hyperloglogTool = tool;
export const runHyperloglog = tool.execute;
export default tool;
