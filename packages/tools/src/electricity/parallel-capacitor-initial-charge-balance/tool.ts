import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacitances: readonly number[];
  readonly voltages: readonly number[];
};
export type Output = { readonly voltage: number; readonly charge: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacitances: { type: "array", maxItems: 256, items: { type: "number" } },
    voltages: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["capacitances", "voltages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { voltage: { type: "number" }, charge: { type: "number" } },
  required: ["voltage", "charge"],
} as const;
/** Find the signed charge-conserving voltage when ideal capacitors are joined with the supplied common polarity. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { capacitances, voltages } = input;
  const compute = (): Output => {
    H.sameLength(capacitances, voltages);
    H.domain(capacitances.length > 0 && capacitances.every((x) => x > 0));
    const total = capacitances.reduce((a, b) => a + b, 0),
      charge = H.dot(capacitances, voltages);
    return { voltage: charge / total, charge };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { capacitances: [1, 3], voltages: [4, 0] },
  output: { voltage: 1, charge: 4 },
} satisfies ToolExample<Input, Output>;
export const parallelCapacitorInitialChargeBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electricity/parallel-capacitor-initial-charge-balance",
      title: "Parallel Capacitor Initial Charge Balance Tool",
      description:
        "Find the signed charge-conserving voltage when ideal capacitors are joined with the supplied common polarity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          capacitances: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          voltages: { type: "array", maxItems: 256, items: { type: "number" } },
        },
        required: ["capacitances", "voltages"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { voltage: { type: "number" }, charge: { type: "number" } },
        required: ["voltage", "charge"],
      },
      ports: {
        inputs: [
          {
            id: "capacitances",
            label: "Capacitances",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "voltages",
            label: "Voltages",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          { id: "voltage", label: "Voltage", valueType: { type: "number" } },
          { id: "charge", label: "Charge", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = parallelCapacitorInitialChargeBalanceTool.execute;
export default parallelCapacitorInitialChargeBalanceTool;
