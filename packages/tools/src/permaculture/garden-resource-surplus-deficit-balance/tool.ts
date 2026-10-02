import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly available: readonly number[];
  readonly needed: readonly number[];
};
export type Output = {
  readonly balances: readonly number[];
  readonly totalSurplus: number;
  readonly totalDeficit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    available: { type: "array", maxItems: 256, items: { type: "number" } },
    needed: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["available", "needed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    balances: { type: "array", maxItems: 256, items: { type: "number" } },
    totalSurplus: { type: "number" },
    totalDeficit: { type: "number" },
  },
  required: ["balances", "totalSurplus", "totalDeficit"],
} as const;
/** Calculate garden resource surplus deficit balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { available, needed } = request;
  const compute = (): Output => {
    H.sameLength(available, needed);
    H.domain(available.every((x) => x >= 0) && needed.every((x) => x >= 0));
    return {
      balances: available.map((x, i) => x - needed[i]),
      totalSurplus: available.reduce(
        (a, x, i) => a + Math.max(0, x - needed[i]),
        0,
      ),
      totalDeficit: available.reduce(
        (a, x, i) => a + Math.max(0, needed[i] - x),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { available: [10, 5, 8], needed: [7, 9, 8] },
  output: { balances: [3, -4, 0], totalSurplus: 3, totalDeficit: 4 },
} satisfies ToolExample<Input, Output>;
export const gardenResourceSurplusDeficitBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "permaculture/garden-resource-surplus-deficit-balance",
      title: "Garden Resource Surplus Deficit Balance Tool",
      description:
        "Calculate garden resource surplus deficit balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          available: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          needed: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["available", "needed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          balances: { type: "array", maxItems: 256, items: { type: "number" } },
          totalSurplus: { type: "number" },
          totalDeficit: { type: "number" },
        },
        required: ["balances", "totalSurplus", "totalDeficit"],
      },
      ports: {
        inputs: [
          {
            id: "available",
            label: "Available",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "needed",
            label: "Needed",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "balances",
            label: "Balances",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "totalSurplus",
            label: "Total Surplus",
            valueType: { type: "number" },
          },
          {
            id: "totalDeficit",
            label: "Total Deficit",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gardenResourceSurplusDeficitBalanceTool.execute;
export default gardenResourceSurplusDeficitBalanceTool;
