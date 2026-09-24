import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly concentration: number; readonly volume: number };
export type Output = { readonly amount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    volume: { type: "number", minimum: 0 },
  },
  required: ["concentration", "volume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { amount: { type: "number" } },
  required: ["amount"],
} as const;
/** Compute amount from a supplied compatible concentration-volume pair. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, volume } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && volume >= 0);
    return { amount: concentration * volume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2, volume: 3 },
  output: { amount: 6 },
} satisfies ToolExample<Input, Output>;
export const compartmentConcentrationVolumeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "computational-biology/compartment-concentration-volume-factor",
      title: "Compartment Concentration Volume Factor Tool",
      description:
        "Compute amount from a supplied compatible concentration-volume pair.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          concentration: { type: "number", minimum: 0 },
          volume: { type: "number", minimum: 0 },
        },
        required: ["concentration", "volume"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { amount: { type: "number" } },
        required: ["amount"],
      },
      ports: {
        inputs: [
          {
            id: "concentration",
            label: "Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "volume",
            label: "Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "amount", label: "Amount", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = compartmentConcentrationVolumeFactorTool.execute;
export default compartmentConcentrationVolumeFactorTool;
