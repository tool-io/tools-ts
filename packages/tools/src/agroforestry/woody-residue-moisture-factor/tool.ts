import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly wetMass: number; readonly dryFraction: number };
export type Output = { readonly dryMass: number; readonly waterMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    dryFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["wetMass", "dryFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMass: { type: "number" }, waterMass: { type: "number" } },
  required: ["dryMass", "waterMass"],
} as const;
/** Calculate woody residue moisture factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, dryFraction } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0);
    H.probability(dryFraction);
    return {
      dryMass: wetMass * dryFraction,
      waterMass: wetMass * (1 - dryFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 10, dryFraction: 0.8 },
  output: { dryMass: 8, waterMass: 1.9999999999999996 },
} satisfies ToolExample<Input, Output>;
export const woodyResidueMoistureFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/woody-residue-moisture-factor",
    title: "Woody Residue Moisture Factor Tool",
    description:
      "Calculate woody residue moisture factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        dryFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["wetMass", "dryFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        waterMass: { type: "number" },
      },
      required: ["dryMass", "waterMass"],
    },
    ports: {
      inputs: [
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        { id: "waterMass", label: "Water Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = woodyResidueMoistureFactorTool.execute;
export default woodyResidueMoistureFactorTool;
