import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMoleFraction: number;
  readonly waterMoleFraction: number;
};
export type Output = { readonly dryMoleFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMoleFraction: { type: "number", minimum: 0 },
    waterMoleFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["wetMoleFraction", "waterMoleFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMoleFraction: { type: "number" } },
  required: ["dryMoleFraction"],
} as const;
/** Calculate dry air mole fraction factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMoleFraction, waterMoleFraction } = request;
  const compute = (): Output => {
    H.domain(
      wetMoleFraction >= 0 &&
        waterMoleFraction >= 0 &&
        waterMoleFraction < 1 &&
        wetMoleFraction <= 1 - waterMoleFraction,
    );
    return { dryMoleFraction: wetMoleFraction / (1 - waterMoleFraction) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMoleFraction: 0.08, waterMoleFraction: 0.2 },
  output: { dryMoleFraction: 0.09999999999999999 },
} satisfies ToolExample<Input, Output>;
export const dryAirMoleFractionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/dry-air-mole-fraction-factor",
    title: "Dry Air Mole Fraction Factor Tool",
    description:
      "Calculate dry air mole fraction factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMoleFraction: { type: "number", minimum: 0 },
        waterMoleFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["wetMoleFraction", "waterMoleFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryMoleFraction: { type: "number" } },
      required: ["dryMoleFraction"],
    },
    ports: {
      inputs: [
        {
          id: "wetMoleFraction",
          label: "Wet Mole Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterMoleFraction",
          label: "Water Mole Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryMoleFraction",
          label: "Dry Mole Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dryAirMoleFractionFactorTool.execute;
export default dryAirMoleFractionFactorTool;
