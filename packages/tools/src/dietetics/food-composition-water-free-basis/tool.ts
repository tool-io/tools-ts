import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly asFedConcentration: number;
  readonly waterFraction: number;
};
export type Output = { readonly dryBasisConcentration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    asFedConcentration: { type: "number", minimum: 0 },
    waterFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["asFedConcentration", "waterFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryBasisConcentration: { type: "number" } },
  required: ["dryBasisConcentration"],
} as const;
/** Calculate food composition water free basis from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { asFedConcentration, waterFraction } = request;
  const compute = (): Output => {
    H.domain(
      asFedConcentration >= 0 && waterFraction >= 0 && waterFraction < 1,
    );
    return { dryBasisConcentration: asFedConcentration / (1 - waterFraction) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { asFedConcentration: 20, waterFraction: 0.8 },
  output: { dryBasisConcentration: 100.00000000000003 },
} satisfies ToolExample<Input, Output>;
export const foodCompositionWaterFreeBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/food-composition-water-free-basis",
    title: "Food Composition Water Free Basis Tool",
    description:
      "Calculate food composition water free basis from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        asFedConcentration: { type: "number", minimum: 0 },
        waterFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["asFedConcentration", "waterFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryBasisConcentration: { type: "number" } },
      required: ["dryBasisConcentration"],
    },
    ports: {
      inputs: [
        {
          id: "asFedConcentration",
          label: "As Fed Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterFraction",
          label: "Water Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryBasisConcentration",
          label: "Dry Basis Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodCompositionWaterFreeBasisTool.execute;
export default foodCompositionWaterFreeBasisTool;
