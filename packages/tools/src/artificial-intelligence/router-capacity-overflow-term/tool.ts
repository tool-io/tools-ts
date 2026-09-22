import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assigned: readonly number[];
  readonly capacities: readonly number[];
};
export type Output = {
  readonly overflow: readonly number[];
  readonly totalOverflow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assigned: { type: "array", maxItems: 256, items: { type: "integer" } },
    capacities: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["assigned", "capacities"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overflow: { type: "array", maxItems: 256, items: { type: "integer" } },
    totalOverflow: { type: "integer" },
  },
  required: ["overflow", "totalOverflow"],
} as const;
/** Calculate router capacity overflow term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assigned, capacities } = request;
  const compute = (): Output => {
    H.sameLength(assigned, capacities);
    H.domain(assigned.every((x) => x >= 0) && capacities.every((x) => x >= 0));
    return {
      overflow: assigned.map((x, i) => Math.max(0, x - capacities[i])),
      totalOverflow: assigned.reduce(
        (s, x, i) => s + Math.max(0, x - capacities[i]),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assigned: [12, 8], capacities: [10, 10] },
  output: { overflow: [2, 0], totalOverflow: 2 },
} satisfies ToolExample<Input, Output>;
export const routerCapacityOverflowTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/router-capacity-overflow-term",
    title: "Router Capacity Overflow Term Tool",
    description:
      "Calculate router capacity overflow term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assigned: { type: "array", maxItems: 256, items: { type: "integer" } },
        capacities: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["assigned", "capacities"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overflow: { type: "array", maxItems: 256, items: { type: "integer" } },
        totalOverflow: { type: "integer" },
      },
      required: ["overflow", "totalOverflow"],
    },
    ports: {
      inputs: [
        {
          id: "assigned",
          label: "Assigned",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "capacities",
          label: "Capacities",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "overflow",
          label: "Overflow",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "totalOverflow",
          label: "Total Overflow",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = routerCapacityOverflowTermTool.execute;
export default routerCapacityOverflowTermTool;
