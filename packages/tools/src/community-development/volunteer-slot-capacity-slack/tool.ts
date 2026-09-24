import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly capacity: number; readonly assigned: number };
export type Output = { readonly slack: number; readonly overbooked: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "integer", minimum: 0 },
    assigned: { type: "integer", minimum: 0 },
  },
  required: ["capacity", "assigned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slack: { type: "integer" }, overbooked: { type: "boolean" } },
  required: ["slack", "overbooked"],
} as const;
/** Calculate volunteer slot capacity slack from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, assigned } = request;
  const compute = (): Output => {
    H.integer(capacity, 0);
    H.integer(assigned, 0);
    return { slack: capacity - assigned, overbooked: assigned > capacity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacity: 12, assigned: 10 },
  output: { slack: 2, overbooked: false },
} satisfies ToolExample<Input, Output>;
export const volunteerSlotCapacitySlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/volunteer-slot-capacity-slack",
    title: "Volunteer Slot Capacity Slack Tool",
    description:
      "Calculate volunteer slot capacity slack from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "integer", minimum: 0 },
        assigned: { type: "integer", minimum: 0 },
      },
      required: ["capacity", "assigned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slack: { type: "integer" },
        overbooked: { type: "boolean" },
      },
      required: ["slack", "overbooked"],
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
          id: "assigned",
          label: "Assigned",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "slack", label: "Slack", valueType: { type: "integer" } },
        {
          id: "overbooked",
          label: "Overbooked",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = volunteerSlotCapacitySlackTool.execute;
export default volunteerSlotCapacitySlackTool;
