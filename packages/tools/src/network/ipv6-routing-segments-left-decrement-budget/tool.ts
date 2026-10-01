import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly segmentsLeft: number;
  readonly availableAddresses: number;
};
export type Output = { readonly remaining: number; readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentsLeft: { type: "integer", minimum: 0, maximum: 255 },
    availableAddresses: { type: "integer", minimum: 0, maximum: 255 },
  },
  required: ["segmentsLeft", "availableAddresses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remaining: { type: "integer" }, valid: { type: "boolean" } },
  required: ["remaining", "valid"],
} as const;
/** Calculate ipv6 routing segments left decrement budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentsLeft, availableAddresses } = request;
  const compute = (): Output => {
    H.integer(segmentsLeft, 0, 255);
    H.integer(availableAddresses, 0, 255);
    return {
      remaining: Math.max(0, segmentsLeft - 1),
      valid: segmentsLeft <= availableAddresses,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segmentsLeft: 3, availableAddresses: 4 },
  output: { remaining: 2, valid: true },
} satisfies ToolExample<Input, Output>;
export const ipv6RoutingSegmentsLeftDecrementBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "network/ipv6-routing-segments-left-decrement-budget",
      title: "IPv6 Routing Segments Left Decrement Budget Tool",
      description:
        "Calculate ipv6 routing segments left decrement budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          segmentsLeft: { type: "integer", minimum: 0, maximum: 255 },
          availableAddresses: { type: "integer", minimum: 0, maximum: 255 },
        },
        required: ["segmentsLeft", "availableAddresses"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remaining: { type: "integer" },
          valid: { type: "boolean" },
        },
        required: ["remaining", "valid"],
      },
      ports: {
        inputs: [
          {
            id: "segmentsLeft",
            label: "Segments Left",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "availableAddresses",
            label: "Available Addresses",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "integer" },
          },
          { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = ipv6RoutingSegmentsLeftDecrementBudgetTool.execute;
export default ipv6RoutingSegmentsLeftDecrementBudgetTool;
