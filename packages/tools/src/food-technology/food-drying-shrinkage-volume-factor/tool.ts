import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialVolume: number;
  readonly finalVolume: number;
  readonly initialMass: number;
  readonly finalMass: number;
};
export type Output = {
  readonly volumeRetention: number;
  readonly massRetention: number;
  readonly densityRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolume: { type: "number", exclusiveMinimum: 0 },
    finalVolume: { type: "number", exclusiveMinimum: 0 },
    initialMass: { type: "number", exclusiveMinimum: 0 },
    finalMass: { type: "number", minimum: 0 },
  },
  required: ["initialVolume", "finalVolume", "initialMass", "finalMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeRetention: { type: "number" },
    massRetention: { type: "number" },
    densityRatio: { type: "number" },
  },
  required: ["volumeRetention", "massRetention", "densityRatio"],
} as const;
/** Calculate food drying shrinkage volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialVolume, finalVolume, initialMass, finalMass } = request;
  const compute = (): Output => {
    H.positive(initialVolume);
    H.positive(finalVolume);
    H.positive(initialMass);
    H.domain(finalMass >= 0);
    return {
      volumeRetention: finalVolume / initialVolume,
      massRetention: finalMass / initialMass,
      densityRatio: finalMass / finalVolume / (initialMass / initialVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialVolume: 100,
    finalVolume: 40,
    initialMass: 200,
    finalMass: 100,
  },
  output: { volumeRetention: 0.4, massRetention: 0.5, densityRatio: 1.25 },
} satisfies ToolExample<Input, Output>;
export const foodDryingShrinkageVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/food-drying-shrinkage-volume-factor",
    title: "Food Drying Shrinkage Volume Factor Tool",
    description:
      "Calculate food drying shrinkage volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialVolume: { type: "number", exclusiveMinimum: 0 },
        finalVolume: { type: "number", exclusiveMinimum: 0 },
        initialMass: { type: "number", exclusiveMinimum: 0 },
        finalMass: { type: "number", minimum: 0 },
      },
      required: ["initialVolume", "finalVolume", "initialMass", "finalMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeRetention: { type: "number" },
        massRetention: { type: "number" },
        densityRatio: { type: "number" },
      },
      required: ["volumeRetention", "massRetention", "densityRatio"],
    },
    ports: {
      inputs: [
        {
          id: "initialVolume",
          label: "Initial Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalVolume",
          label: "Final Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "initialMass",
          label: "Initial Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finalMass",
          label: "Final Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeRetention",
          label: "Volume Retention",
          valueType: { type: "number" },
        },
        {
          id: "massRetention",
          label: "Mass Retention",
          valueType: { type: "number" },
        },
        {
          id: "densityRatio",
          label: "Density Ratio",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodDryingShrinkageVolumeFactorTool.execute;
export default foodDryingShrinkageVolumeFactorTool;
