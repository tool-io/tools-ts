import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly absoluteRoughness: number;
  readonly diameter: number;
  readonly roughnessUncertainty: number;
};
export type Output = {
  readonly relativeRoughness: number;
  readonly relativeUncertainty: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteRoughness: { type: "number", minimum: 0 },
    diameter: { type: "number", exclusiveMinimum: 0 },
    roughnessUncertainty: { type: "number", minimum: 0 },
  },
  required: ["absoluteRoughness", "diameter", "roughnessUncertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeRoughness: { type: "number" },
    relativeUncertainty: { type: "number" },
  },
  required: ["relativeRoughness", "relativeUncertainty"],
} as const;
/** Calculate pipe roughness relative diameter factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { absoluteRoughness, diameter, roughnessUncertainty } = request;
  const compute = (): Output => {
    H.domain(absoluteRoughness >= 0 && roughnessUncertainty >= 0);
    H.positive(diameter);
    return {
      relativeRoughness: absoluteRoughness / diameter,
      relativeUncertainty: roughnessUncertainty / diameter,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { absoluteRoughness: 0.1, diameter: 100, roughnessUncertainty: 0.02 },
  output: { relativeRoughness: 0.001, relativeUncertainty: 0.0002 },
} satisfies ToolExample<Input, Output>;
export const pipeRoughnessRelativeDiameterFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chemical-engineering/pipe-roughness-relative-diameter-factor",
      title: "Pipe Roughness Relative Diameter Factor Tool",
      description:
        "Calculate pipe roughness relative diameter factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          absoluteRoughness: { type: "number", minimum: 0 },
          diameter: { type: "number", exclusiveMinimum: 0 },
          roughnessUncertainty: { type: "number", minimum: 0 },
        },
        required: ["absoluteRoughness", "diameter", "roughnessUncertainty"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          relativeRoughness: { type: "number" },
          relativeUncertainty: { type: "number" },
        },
        required: ["relativeRoughness", "relativeUncertainty"],
      },
      ports: {
        inputs: [
          {
            id: "absoluteRoughness",
            label: "Absolute Roughness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "diameter",
            label: "Diameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "roughnessUncertainty",
            label: "Roughness Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "relativeRoughness",
            label: "Relative Roughness",
            valueType: { type: "number" },
          },
          {
            id: "relativeUncertainty",
            label: "Relative Uncertainty",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pipeRoughnessRelativeDiameterFactorTool.execute;
export default pipeRoughnessRelativeDiameterFactorTool;
