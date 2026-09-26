import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly linearPredictor: number;
  readonly coefficient: number;
  readonly scale: number;
};
export type Output = { readonly density: number; readonly effect: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearPredictor: { type: "number" },
    coefficient: { type: "number" },
    scale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["linearPredictor", "coefficient", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { density: { type: "number" }, effect: { type: "number" } },
  required: ["density", "effect"],
} as const;
/** Calculate probit density scale one parameter from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { linearPredictor, coefficient, scale } = request;
  const compute = (): Output => {
    H.positive(scale);
    return {
      density:
        Math.exp(-0.5 * (linearPredictor / scale) ** 2) /
        (Math.sqrt(2 * Math.PI) * scale),
      effect:
        (coefficient * Math.exp(-0.5 * (linearPredictor / scale) ** 2)) /
        (Math.sqrt(2 * Math.PI) * scale),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { linearPredictor: 0, coefficient: 2, scale: 1 },
  output: { density: 0.3989422804014327, effect: 0.7978845608028654 },
} satisfies ToolExample<Input, Output>;
export const probitDensityScaleOneParameterTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/probit-density-scale-one-parameter",
    title: "Probit Density Scale One Parameter Tool",
    description:
      "Calculate probit density scale one parameter from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearPredictor: { type: "number" },
        coefficient: { type: "number" },
        scale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["linearPredictor", "coefficient", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { density: { type: "number" }, effect: { type: "number" } },
      required: ["density", "effect"],
    },
    ports: {
      inputs: [
        {
          id: "linearPredictor",
          label: "Linear Predictor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "density", label: "Density", valueType: { type: "number" } },
        { id: "effect", label: "Effect", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = probitDensityScaleOneParameterTool.execute;
export default probitDensityScaleOneParameterTool;
