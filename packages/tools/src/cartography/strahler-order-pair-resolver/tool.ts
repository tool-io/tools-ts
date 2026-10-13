import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly orderA: number;
  readonly orderB: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "orderA", label: "Order a", kind: "number" },
  { id: "orderB", label: "Order b", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.orderA, "order", 1, 1000);
  bounded(i.orderB, "order", 1, 1000);
  return {
    mergedOrder:
      i.orderA === i.orderB ? i.orderA + 1 : Math.max(i.orderA, i.orderB),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { orderA: 2, orderB: 2 },
  output: { result: { mergedOrder: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/strahler-order-pair-resolver",
  title: "Strahler Stream Order Pair Merge Resolver",
  description:
    "Resolve Strahler order for an explicitly established two-stream confluence; no network delineation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { mergedOrder: { type: "number" } },
        required: ["mergedOrder"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
