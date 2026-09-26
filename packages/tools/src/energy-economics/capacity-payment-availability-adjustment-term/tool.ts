import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacityKw: number;
  readonly paymentPerKw: number;
  readonly availableHours: number;
  readonly contractedHours: number;
};
export type Output = {
  readonly availability: number;
  readonly payment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacityKw: { type: "number", minimum: 0 },
    paymentPerKw: { type: "number" },
    availableHours: { type: "number", minimum: 0 },
    contractedHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["capacityKw", "paymentPerKw", "availableHours", "contractedHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { availability: { type: "number" }, payment: { type: "number" } },
  required: ["availability", "payment"],
} as const;
/** Calculate capacity payment availability adjustment term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacityKw, paymentPerKw, availableHours, contractedHours } = request;
  const compute = (): Output => {
    H.domain(
      capacityKw >= 0 &&
        availableHours >= 0 &&
        availableHours <= contractedHours,
    );
    H.positive(contractedHours);
    return {
      availability: availableHours / contractedHours,
      payment: (capacityKw * paymentPerKw * availableHours) / contractedHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    capacityKw: 100,
    paymentPerKw: 20,
    availableHours: 90,
    contractedHours: 100,
  },
  output: { availability: 0.9, payment: 1800 },
} satisfies ToolExample<Input, Output>;
export const capacityPaymentAvailabilityAdjustmentTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "energy-economics/capacity-payment-availability-adjustment-term",
      title: "Capacity Payment Availability Adjustment Term Tool",
      description:
        "Calculate capacity payment availability adjustment term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capacityKw: { type: "number", minimum: 0 },
          paymentPerKw: { type: "number" },
          availableHours: { type: "number", minimum: 0 },
          contractedHours: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "capacityKw",
          "paymentPerKw",
          "availableHours",
          "contractedHours",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availability: { type: "number" },
          payment: { type: "number" },
        },
        required: ["availability", "payment"],
      },
      ports: {
        inputs: [
          {
            id: "capacityKw",
            label: "Capacity Kw",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "paymentPerKw",
            label: "Payment Per Kw",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "availableHours",
            label: "Available Hours",
            required: true,
            valueType: { type: "number", unit: "h" },
          },
          {
            id: "contractedHours",
            label: "Contracted Hours",
            required: true,
            valueType: { type: "number", unit: "h" },
          },
        ],
        outputs: [
          {
            id: "availability",
            label: "Availability",
            valueType: { type: "number" },
          },
          { id: "payment", label: "Payment", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = capacityPaymentAvailabilityAdjustmentTermTool.execute;
export default capacityPaymentAvailabilityAdjustmentTermTool;
