import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diffusivity: number;
  readonly decayRate: number;
  readonly sourceConcentration: number;
  readonly distance: number;
};
export type Output = {
  readonly decayLength: number;
  readonly concentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diffusivity: { type: "number", exclusiveMinimum: 0 },
    decayRate: { type: "number", exclusiveMinimum: 0 },
    sourceConcentration: { type: "number", minimum: 0 },
    distance: { type: "number", minimum: 0 },
  },
  required: ["diffusivity", "decayRate", "sourceConcentration", "distance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    decayLength: { type: "number" },
    concentration: { type: "number" },
  },
  required: ["decayLength", "concentration"],
} as const;
/** Steady one-dimensional constant-coefficient diffusion/first-order-decay profile with an explicit boundary concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diffusivity, decayRate, sourceConcentration, distance } = request;
  const compute = (): Output => {
    H.positive(diffusivity);
    H.positive(decayRate);
    H.domain(sourceConcentration >= 0 && distance >= 0);
    return {
      decayLength: Math.sqrt(diffusivity / decayRate),
      concentration:
        sourceConcentration *
        Math.exp(-distance / Math.sqrt(diffusivity / decayRate)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    diffusivity: 4,
    decayRate: 1,
    sourceConcentration: 100,
    distance: 2,
  },
  output: { decayLength: 2, concentration: 36.787944117144235 },
} satisfies ToolExample<Input, Output>;
export const morphogenExponentialDecayLengthTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-biology/morphogen-exponential-decay-length-term",
      title: "Morphogen Exponential Decay Length Term Tool",
      description:
        "Steady one-dimensional constant-coefficient diffusion/first-order-decay profile with an explicit boundary concentration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          diffusivity: { type: "number", exclusiveMinimum: 0 },
          decayRate: { type: "number", exclusiveMinimum: 0 },
          sourceConcentration: { type: "number", minimum: 0 },
          distance: { type: "number", minimum: 0 },
        },
        required: [
          "diffusivity",
          "decayRate",
          "sourceConcentration",
          "distance",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          decayLength: { type: "number" },
          concentration: { type: "number" },
        },
        required: ["decayLength", "concentration"],
      },
      ports: {
        inputs: [
          {
            id: "diffusivity",
            label: "Diffusivity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "decayRate",
            label: "Decay Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourceConcentration",
            label: "Source Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "decayLength",
            label: "Decay Length",
            valueType: { type: "number" },
          },
          {
            id: "concentration",
            label: "Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = morphogenExponentialDecayLengthTermTool.execute;
export default morphogenExponentialDecayLengthTermTool;
