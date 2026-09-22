import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly moistureFraction: number;
};
export type Output = { readonly dryMass: number; readonly dryShare: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    moistureFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["wetMass", "moistureFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMass: { type: "number" }, dryShare: { type: "number" } },
  required: ["dryMass", "dryShare"],
} as const;
/** Calculate feed moisture dry share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, moistureFraction } = request;
  const compute = (): Output => {
    H.domain(wetMass >= 0);
    H.probability(moistureFraction);
    return {
      dryMass: wetMass * (1 - moistureFraction),
      dryShare: 1 - moistureFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetMass: 10, moistureFraction: 0.2 },
  output: { dryMass: 8, dryShare: 0.8 },
} satisfies ToolExample<Input, Output>;
export const feedMoistureDryShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/feed-moisture-dry-share",
    title: "Feed Moisture Dry Share Tool",
    description:
      "Calculate feed moisture dry share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMass: { type: "number", minimum: 0 },
        moistureFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["wetMass", "moistureFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryMass: { type: "number" }, dryShare: { type: "number" } },
      required: ["dryMass", "dryShare"],
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
          id: "moistureFraction",
          label: "Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        { id: "dryShare", label: "Dry Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = feedMoistureDryShareTool.execute;
export default feedMoistureDryShareTool;
