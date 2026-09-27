import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialDensity: number;
  readonly foamDensity: number;
  readonly initialVolume: number;
  readonly foamVolume: number;
  readonly massConserved: boolean;
};
export type Output = {
  readonly densityOverrun: number;
  readonly volumeOverrun: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialDensity: { type: "number", exclusiveMinimum: 0 },
    foamDensity: { type: "number", exclusiveMinimum: 0 },
    initialVolume: { type: "number", exclusiveMinimum: 0 },
    foamVolume: { type: "number", exclusiveMinimum: 0 },
    massConserved: { type: "boolean" },
  },
  required: [
    "initialDensity",
    "foamDensity",
    "initialVolume",
    "foamVolume",
    "massConserved",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    densityOverrun: { type: "number" },
    volumeOverrun: { type: "number" },
    residual: { type: "number" },
  },
  required: ["densityOverrun", "volumeOverrun", "residual"],
} as const;
/** Compare measured density and volume overrun under the supplied conserved-mass assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    initialDensity,
    foamDensity,
    initialVolume,
    foamVolume,
    massConserved,
  } = request;
  const compute = (): Output => {
    H.positive(initialDensity);
    H.positive(foamDensity);
    H.positive(initialVolume);
    H.positive(foamVolume);
    H.domain(massConserved);
    return {
      densityOverrun: initialDensity / foamDensity - 1,
      volumeOverrun: foamVolume / initialVolume - 1,
      residual: initialDensity / foamDensity - foamVolume / initialVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialDensity: 1,
    foamDensity: 0.5,
    initialVolume: 10,
    foamVolume: 20,
    massConserved: true,
  },
  output: { densityOverrun: 1, volumeOverrun: 1, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const foodFoamOverrunDensityVolumeConsistencyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-technology/food-foam-overrun-density-volume-consistency",
      title: "Food Foam Overrun Density Volume Consistency Tool",
      description:
        "Compare measured density and volume overrun under the supplied conserved-mass assumption.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialDensity: { type: "number", exclusiveMinimum: 0 },
          foamDensity: { type: "number", exclusiveMinimum: 0 },
          initialVolume: { type: "number", exclusiveMinimum: 0 },
          foamVolume: { type: "number", exclusiveMinimum: 0 },
          massConserved: { type: "boolean" },
        },
        required: [
          "initialDensity",
          "foamDensity",
          "initialVolume",
          "foamVolume",
          "massConserved",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          densityOverrun: { type: "number" },
          volumeOverrun: { type: "number" },
          residual: { type: "number" },
        },
        required: ["densityOverrun", "volumeOverrun", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "initialDensity",
            label: "Initial Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "foamDensity",
            label: "Foam Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialVolume",
            label: "Initial Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "foamVolume",
            label: "Foam Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "massConserved",
            label: "Mass Conserved",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "densityOverrun",
            label: "Density Overrun",
            valueType: { type: "number" },
          },
          {
            id: "volumeOverrun",
            label: "Volume Overrun",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = foodFoamOverrunDensityVolumeConsistencyTool.execute;
export default foodFoamOverrunDensityVolumeConsistencyTool;
