import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputEnergyPrice: number;
  readonly roundtripEfficiency: number;
  readonly outputOtherCost: number;
};
export type Output = { readonly outputUnitCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputEnergyPrice: { type: "number" },
    roundtripEfficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    outputOtherCost: { type: "number" },
  },
  required: ["inputEnergyPrice", "roundtripEfficiency", "outputOtherCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outputUnitCost: { type: "number" } },
  required: ["outputUnitCost"],
} as const;
/** Convert input energy price to an output basis using a supplied round-trip efficiency and additive cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputEnergyPrice, roundtripEfficiency, outputOtherCost } = request;
  const compute = (): Output => {
    H.domain(roundtripEfficiency > 0 && roundtripEfficiency <= 1);
    return {
      outputUnitCost: inputEnergyPrice / roundtripEfficiency + outputOtherCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputEnergyPrice: 40, roundtripEfficiency: 0.8, outputOtherCost: 5 },
  output: { outputUnitCost: 55 },
} satisfies ToolExample<Input, Output>;
export const storageRoundtripCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/storage-roundtrip-cost-term",
    title: "Storage Roundtrip Cost Term Tool",
    description:
      "Convert input energy price to an output basis using a supplied round-trip efficiency and additive cost.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputEnergyPrice: { type: "number" },
        roundtripEfficiency: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
        outputOtherCost: { type: "number" },
      },
      required: ["inputEnergyPrice", "roundtripEfficiency", "outputOtherCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { outputUnitCost: { type: "number" } },
      required: ["outputUnitCost"],
    },
    ports: {
      inputs: [
        {
          id: "inputEnergyPrice",
          label: "Input Energy Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "roundtripEfficiency",
          label: "Roundtrip Efficiency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outputOtherCost",
          label: "Output Other Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "outputUnitCost",
          label: "Output Unit Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = storageRoundtripCostTermTool.execute;
export default storageRoundtripCostTermTool;
