import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly allocation: number; readonly capacity: number };
export type Output = { readonly retained: number; readonly excess: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocation: { type: "number", minimum: 0 },
    capacity: { type: "number", minimum: 0 },
  },
  required: ["allocation", "capacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { retained: { type: "number" }, excess: { type: "number" } },
  required: ["retained", "excess"],
} as const;
/** Calculate share capacity excess transfer term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { allocation, capacity } = input;
  const compute = (): Output => {
    H.domain(allocation >= 0 && capacity >= 0);
    return {
      retained: Math.min(allocation, capacity),
      excess: Math.max(0, allocation - capacity),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { allocation: 12, capacity: 8 },
  output: { retained: 8, excess: 4 },
} satisfies ToolExample<Input, Output>;
export const shareCapacityExcessTransferTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/share-capacity-excess-transfer-term",
    title: "Share Capacity Excess Transfer Term Tool",
    description:
      "Calculate share capacity excess transfer term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocation: { type: "number", minimum: 0 },
        capacity: { type: "number", minimum: 0 },
      },
      required: ["allocation", "capacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { retained: { type: "number" }, excess: { type: "number" } },
      required: ["retained", "excess"],
    },
    ports: {
      inputs: [
        {
          id: "allocation",
          label: "Allocation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "retained", label: "Retained", valueType: { type: "number" } },
        { id: "excess", label: "Excess", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = shareCapacityExcessTransferTermTool.execute;
export default shareCapacityExcessTransferTermTool;
