import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacity: number;
  readonly occupied: number;
  readonly reserved: number;
};
export type Output = { readonly slack: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "integer", minimum: 0 },
    occupied: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
  },
  required: ["capacity", "occupied", "reserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "integer" } },
  required: ["slack"],
} as const;
/** Calculate freezer position capacity slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, occupied, reserved } = request;
  const compute = (): Output => {
    H.integer(capacity, 0);
    H.integer(occupied, 0);
    H.integer(reserved, 0);
    return {
      slack: Number(BigInt(capacity) - BigInt(occupied) - BigInt(reserved)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacity: 100, occupied: 80, reserved: 15 },
  output: { slack: 5 },
} satisfies ToolExample<Input, Output>;
export const freezerPositionCapacitySlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/freezer-position-capacity-slack",
    title: "Freezer Position Capacity Slack Tool",
    description:
      "Calculate freezer position capacity slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "integer", minimum: 0 },
        occupied: { type: "integer", minimum: 0 },
        reserved: { type: "integer", minimum: 0 },
      },
      required: ["capacity", "occupied", "reserved"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slack: { type: "integer" } },
      required: ["slack"],
    },
    ports: {
      inputs: [
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "occupied",
          label: "Occupied",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reserved",
          label: "Reserved",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "slack", label: "Slack", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = freezerPositionCapacitySlackTool.execute;
export default freezerPositionCapacitySlackTool;
