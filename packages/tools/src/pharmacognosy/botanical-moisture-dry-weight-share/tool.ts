import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly waterMass: number; readonly wetMass: number };
export type Output = { readonly dryMass: number; readonly dryFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterMass: { type: "number", minimum: 0 },
    wetMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["waterMass", "wetMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMass: { type: "number" }, dryFraction: { type: "number" } },
  required: ["dryMass", "dryFraction"],
} as const;
/** Calculate botanical moisture dry weight share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { waterMass, wetMass } = request;
  const compute = (): Output => {
    H.positive(wetMass);
    H.domain(waterMass >= 0 && waterMass <= wetMass);
    return {
      dryMass: wetMass - waterMass,
      dryFraction: (wetMass - waterMass) / wetMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { waterMass: 2, wetMass: 10 },
  output: { dryMass: 8, dryFraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const botanicalMoistureDryWeightShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/botanical-moisture-dry-weight-share",
    title: "Botanical Moisture Dry Weight Share Tool",
    description:
      "Calculate botanical moisture dry weight share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterMass: { type: "number", minimum: 0 },
        wetMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["waterMass", "wetMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        dryFraction: { type: "number" },
      },
      required: ["dryMass", "dryFraction"],
    },
    ports: {
      inputs: [
        {
          id: "waterMass",
          label: "Water Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = botanicalMoistureDryWeightShareTool.execute;
export default botanicalMoistureDryWeightShareTool;
