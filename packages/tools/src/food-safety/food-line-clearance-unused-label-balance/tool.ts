import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issued: number;
  readonly used: number;
  readonly destroyed: number;
  readonly returned: number;
};
export type Output = {
  readonly unaccounted: number;
  readonly allAccounted: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issued: { type: "integer", minimum: 0 },
    used: { type: "integer", minimum: 0 },
    destroyed: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
  },
  required: ["issued", "used", "destroyed", "returned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unaccounted: { type: "integer" },
    allAccounted: { type: "boolean" },
  },
  required: ["unaccounted", "allAccounted"],
} as const;
/** Signed label inventory discrepancy without certifying physical line clearance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issued, used, destroyed, returned } = request;
  const compute = (): Output => {
    H.integer(issued, 0);
    H.integer(used, 0);
    H.integer(destroyed, 0);
    H.integer(returned, 0);
    return {
      unaccounted: issued - used - destroyed - returned,
      allAccounted: issued === used + destroyed + returned,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issued: 1000, used: 800, destroyed: 50, returned: 100 },
  output: { unaccounted: 50, allAccounted: false },
} satisfies ToolExample<Input, Output>;
export const foodLineClearanceUnusedLabelBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-safety/food-line-clearance-unused-label-balance",
      title: "Food Line Clearance Unused Label Balance Tool",
      description:
        "Signed label inventory discrepancy without certifying physical line clearance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          issued: { type: "integer", minimum: 0 },
          used: { type: "integer", minimum: 0 },
          destroyed: { type: "integer", minimum: 0 },
          returned: { type: "integer", minimum: 0 },
        },
        required: ["issued", "used", "destroyed", "returned"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unaccounted: { type: "integer" },
          allAccounted: { type: "boolean" },
        },
        required: ["unaccounted", "allAccounted"],
      },
      ports: {
        inputs: [
          {
            id: "issued",
            label: "Issued",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "used",
            label: "Used",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "destroyed",
            label: "Destroyed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returned",
            label: "Returned",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "unaccounted",
            label: "Unaccounted",
            valueType: { type: "integer" },
          },
          {
            id: "allAccounted",
            label: "All Accounted",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = foodLineClearanceUnusedLabelBalanceTool.execute;
export default foodLineClearanceUnusedLabelBalanceTool;
