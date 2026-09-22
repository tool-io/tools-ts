import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly proteinMass: number;
  readonly partialSpecificVolume: number;
  readonly solventDensity: number;
};
export type Output = {
  readonly displacedVolume: number;
  readonly buoyantMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proteinMass: { type: "number", minimum: 0 },
    partialSpecificVolume: { type: "number", minimum: 0 },
    solventDensity: { type: "number", minimum: 0 },
  },
  required: ["proteinMass", "partialSpecificVolume", "solventDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displacedVolume: { type: "number" },
    buoyantMass: { type: "number" },
  },
  required: ["displacedVolume", "buoyantMass"],
} as const;
/** Calculate protein partial specific volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { proteinMass, partialSpecificVolume, solventDensity } = request;
  const compute = (): Output => {
    H.domain(
      proteinMass >= 0 && partialSpecificVolume >= 0 && solventDensity >= 0,
    );
    return {
      displacedVolume: proteinMass * partialSpecificVolume,
      buoyantMass: proteinMass * (1 - solventDensity * partialSpecificVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { proteinMass: 10, partialSpecificVolume: 0.7, solventDensity: 1 },
  output: { displacedVolume: 7, buoyantMass: 3.0000000000000004 },
} satisfies ToolExample<Input, Output>;
export const proteinPartialSpecificVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/protein-partial-specific-volume-factor",
    title: "Protein Partial Specific Volume Factor Tool",
    description:
      "Calculate protein partial specific volume factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        proteinMass: { type: "number", minimum: 0 },
        partialSpecificVolume: { type: "number", minimum: 0 },
        solventDensity: { type: "number", minimum: 0 },
      },
      required: ["proteinMass", "partialSpecificVolume", "solventDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displacedVolume: { type: "number" },
        buoyantMass: { type: "number" },
      },
      required: ["displacedVolume", "buoyantMass"],
    },
    ports: {
      inputs: [
        {
          id: "proteinMass",
          label: "Protein Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "partialSpecificVolume",
          label: "Partial Specific Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solventDensity",
          label: "Solvent Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "displacedVolume",
          label: "Displaced Volume",
          valueType: { type: "number" },
        },
        {
          id: "buoyantMass",
          label: "Buoyant Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = proteinPartialSpecificVolumeFactorTool.execute;
export default proteinPartialSpecificVolumeFactorTool;
