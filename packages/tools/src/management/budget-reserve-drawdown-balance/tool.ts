import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingReserve: number;
  readonly draws: readonly number[];
  readonly replenishments: readonly number[];
};
export type Output = {
  readonly closingReserve: number;
  readonly overdrawn: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingReserve: { type: "number", minimum: 0 },
    draws: { type: "array", maxItems: 256, items: { type: "number" } },
    replenishments: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["openingReserve", "draws", "replenishments"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closingReserve: { type: "number" },
    overdrawn: { type: "boolean" },
  },
  required: ["closingReserve", "overdrawn"],
} as const;
/** Calculate budget reserve drawdown balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingReserve, draws, replenishments } = request;
  const compute = (): Output => {
    H.domain(
      openingReserve >= 0 &&
        draws.every((x) => x >= 0) &&
        replenishments.every((x) => x >= 0),
    );
    return {
      closingReserve:
        openingReserve -
        draws.reduce((a, b) => a + b, 0) +
        replenishments.reduce((a, b) => a + b, 0),
      overdrawn:
        openingReserve + replenishments.reduce((a, b) => a + b, 0) <
        draws.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingReserve: 100, draws: [20, 30], replenishments: [10] },
  output: { closingReserve: 60, overdrawn: false },
} satisfies ToolExample<Input, Output>;
export const budgetReserveDrawdownBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/budget-reserve-drawdown-balance",
    title: "Budget Reserve Drawdown Balance Tool",
    description:
      "Calculate budget reserve drawdown balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingReserve: { type: "number", minimum: 0 },
        draws: { type: "array", maxItems: 256, items: { type: "number" } },
        replenishments: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["openingReserve", "draws", "replenishments"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closingReserve: { type: "number" },
        overdrawn: { type: "boolean" },
      },
      required: ["closingReserve", "overdrawn"],
    },
    ports: {
      inputs: [
        {
          id: "openingReserve",
          label: "Opening Reserve",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "draws",
          label: "Draws",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "replenishments",
          label: "Replenishments",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "closingReserve",
          label: "Closing Reserve",
          valueType: { type: "number" },
        },
        { id: "overdrawn", label: "Overdrawn", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = budgetReserveDrawdownBalanceTool.execute;
export default budgetReserveDrawdownBalanceTool;
