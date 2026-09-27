import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coalitionValue: number;
  readonly allocatedPayoffs: readonly number[];
};
export type Output = {
  readonly allocated: number;
  readonly excess: number;
  readonly blocked: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coalitionValue: { type: "number" },
    allocatedPayoffs: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["coalitionValue", "allocatedPayoffs"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocated: { type: "number" },
    excess: { type: "number" },
    blocked: { type: "boolean" },
  },
  required: ["allocated", "excess", "blocked"],
} as const;
/** Calculate core coalition excess one subset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coalitionValue, allocatedPayoffs } = request;
  const compute = (): Output => {
    H.domain(allocatedPayoffs.length > 0);
    return {
      allocated: allocatedPayoffs.reduce((a, b) => a + b, 0),
      excess: coalitionValue - allocatedPayoffs.reduce((a, b) => a + b, 0),
      blocked: coalitionValue > allocatedPayoffs.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coalitionValue: 10, allocatedPayoffs: [3, 4] },
  output: { allocated: 7, excess: 3, blocked: true },
} satisfies ToolExample<Input, Output>;
export const coreCoalitionExcessOneSubsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/core-coalition-excess-one-subset",
    title: "Core Coalition Excess One Subset Tool",
    description:
      "Calculate core coalition excess one subset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coalitionValue: { type: "number" },
        allocatedPayoffs: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["coalitionValue", "allocatedPayoffs"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocated: { type: "number" },
        excess: { type: "number" },
        blocked: { type: "boolean" },
      },
      required: ["allocated", "excess", "blocked"],
    },
    ports: {
      inputs: [
        {
          id: "coalitionValue",
          label: "Coalition Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedPayoffs",
          label: "Allocated Payoffs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "allocated", label: "Allocated", valueType: { type: "number" } },
        { id: "excess", label: "Excess", valueType: { type: "number" } },
        { id: "blocked", label: "Blocked", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = coreCoalitionExcessOneSubsetTool.execute;
export default coreCoalitionExcessOneSubsetTool;
