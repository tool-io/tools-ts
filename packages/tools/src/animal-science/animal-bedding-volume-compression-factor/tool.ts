import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly looseVolume: number;
  readonly retainedFraction: number;
  readonly area: number;
};
export type Output = {
  readonly installedVolume: number;
  readonly installedDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    looseVolume: { type: "number", minimum: 0 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
    area: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["looseVolume", "retainedFraction", "area"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    installedVolume: { type: "number" },
    installedDepth: { type: "number" },
  },
  required: ["installedVolume", "installedDepth"],
} as const;
/** Calculate animal bedding volume compression factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { looseVolume, retainedFraction, area } = request;
  const compute = (): Output => {
    H.domain(looseVolume >= 0);
    H.probability(retainedFraction);
    H.positive(area);
    return {
      installedVolume: looseVolume * retainedFraction,
      installedDepth: (looseVolume * retainedFraction) / area,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { looseVolume: 10, retainedFraction: 0.6, area: 20 },
  output: { installedVolume: 6, installedDepth: 0.3 },
} satisfies ToolExample<Input, Output>;
export const animalBeddingVolumeCompressionFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "animal-science/animal-bedding-volume-compression-factor",
      title: "Animal Bedding Volume Compression Factor Tool",
      description:
        "Calculate animal bedding volume compression factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          looseVolume: { type: "number", minimum: 0 },
          retainedFraction: { type: "number", minimum: 0, maximum: 1 },
          area: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["looseVolume", "retainedFraction", "area"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          installedVolume: { type: "number" },
          installedDepth: { type: "number" },
        },
        required: ["installedVolume", "installedDepth"],
      },
      ports: {
        inputs: [
          {
            id: "looseVolume",
            label: "Loose Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retainedFraction",
            label: "Retained Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "installedVolume",
            label: "Installed Volume",
            valueType: { type: "number" },
          },
          {
            id: "installedDepth",
            label: "Installed Depth",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = animalBeddingVolumeCompressionFactorTool.execute;
export default animalBeddingVolumeCompressionFactorTool;
