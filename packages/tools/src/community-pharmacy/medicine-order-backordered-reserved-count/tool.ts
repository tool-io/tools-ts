import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requested: number;
  readonly supplied: number;
  readonly reserved: number;
  readonly cancelled: number;
};
export type Output = {
  readonly remaining: number;
  readonly backordered: number;
  readonly fillShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requested: { type: "integer", minimum: 1 },
    supplied: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
    cancelled: { type: "integer", minimum: 0 },
  },
  required: ["requested", "supplied", "reserved", "cancelled"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "integer" },
    backordered: { type: "integer" },
    fillShare: { type: "number" },
  },
  required: ["remaining", "backordered", "fillShare"],
} as const;
/** Calculate medicine order backordered reserved count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requested, supplied, reserved, cancelled } = request;
  const compute = (): Output => {
    H.integer(requested, 1);
    H.integer(supplied, 0, requested);
    H.integer(reserved, 0);
    H.integer(cancelled, 0);
    H.domain(supplied + reserved + cancelled <= requested);
    return {
      remaining: requested - supplied - cancelled,
      backordered: requested - supplied - cancelled - reserved,
      fillShare: supplied / requested,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requested: 100, supplied: 40, reserved: 20, cancelled: 10 },
  output: { remaining: 50, backordered: 30, fillShare: 0.4 },
} satisfies ToolExample<Input, Output>;
export const medicineOrderBackorderedReservedCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "community-pharmacy/medicine-order-backordered-reserved-count",
      title: "Medicine Order Backordered Reserved Count Tool",
      description:
        "Calculate medicine order backordered reserved count from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requested: { type: "integer", minimum: 1 },
          supplied: { type: "integer", minimum: 0 },
          reserved: { type: "integer", minimum: 0 },
          cancelled: { type: "integer", minimum: 0 },
        },
        required: ["requested", "supplied", "reserved", "cancelled"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remaining: { type: "integer" },
          backordered: { type: "integer" },
          fillShare: { type: "number" },
        },
        required: ["remaining", "backordered", "fillShare"],
      },
      ports: {
        inputs: [
          {
            id: "requested",
            label: "Requested",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "supplied",
            label: "Supplied",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reserved",
            label: "Reserved",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "cancelled",
            label: "Cancelled",
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
          {
            id: "backordered",
            label: "Backordered",
            valueType: { type: "integer" },
          },
          {
            id: "fillShare",
            label: "Fill Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = medicineOrderBackorderedReservedCountTool.execute;
export default medicineOrderBackorderedReservedCountTool;
