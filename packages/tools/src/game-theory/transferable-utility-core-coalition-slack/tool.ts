import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coalitionAllocatedPayoffs: readonly number[];
  readonly coalitionValue: number;
};
export type Output = {
  readonly allocatedTotal: number;
  readonly coalitionSlack: number;
  readonly satisfiesCoalitionInequality: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coalitionAllocatedPayoffs: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    coalitionValue: { type: "number" },
  },
  required: ["coalitionAllocatedPayoffs", "coalitionValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedTotal: { type: "number" },
    coalitionSlack: { type: "number" },
    satisfiesCoalitionInequality: { type: "boolean" },
  },
  required: [
    "allocatedTotal",
    "coalitionSlack",
    "satisfiesCoalitionInequality",
  ],
} as const;
/** Check one explicit transferable-utility coalition allocation inequality without asserting full core membership or efficiency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coalitionAllocatedPayoffs, coalitionValue } = request;
  const compute = (): Output => {
    return (() => {
      const allocatedTotal = coalitionAllocatedPayoffs.reduce(
        (sum, value) => sum + value,
        0,
      );
      return {
        allocatedTotal,
        coalitionSlack: allocatedTotal - coalitionValue,
        satisfiesCoalitionInequality: allocatedTotal >= coalitionValue,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coalitionAllocatedPayoffs: [3, 4], coalitionValue: 6 },
  output: {
    allocatedTotal: 7,
    coalitionSlack: 1,
    satisfiesCoalitionInequality: true,
  },
} satisfies ToolExample<Input, Output>;
export const transferableUtilityCoreCoalitionSlackTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "game-theory/transferable-utility-core-coalition-slack",
      title: "Transferable Utility Core Coalition Slack Tool",
      description:
        "Check one explicit transferable-utility coalition allocation inequality without asserting full core membership or efficiency.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coalitionAllocatedPayoffs: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          coalitionValue: { type: "number" },
        },
        required: ["coalitionAllocatedPayoffs", "coalitionValue"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          allocatedTotal: { type: "number" },
          coalitionSlack: { type: "number" },
          satisfiesCoalitionInequality: { type: "boolean" },
        },
        required: [
          "allocatedTotal",
          "coalitionSlack",
          "satisfiesCoalitionInequality",
        ],
      },
      ports: {
        inputs: [
          {
            id: "coalitionAllocatedPayoffs",
            label: "Coalition Allocated Payoffs",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "coalitionValue",
            label: "Coalition Value",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "allocatedTotal",
            label: "Allocated Total",
            valueType: { type: "number" },
          },
          {
            id: "coalitionSlack",
            label: "Coalition Slack",
            valueType: { type: "number" },
          },
          {
            id: "satisfiesCoalitionInequality",
            label: "Satisfies Coalition Inequality",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = transferableUtilityCoreCoalitionSlackTool.execute;
export default transferableUtilityCoreCoalitionSlackTool;
