import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly warburgCoefficient: number;
  readonly angularFrequency: number;
};
export type Output = { readonly real: number; readonly imaginary: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    warburgCoefficient: { type: "number", minimum: 0 },
    angularFrequency: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["warburgCoefficient", "angularFrequency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { real: { type: "number" }, imaginary: { type: "number" } },
  required: ["real", "imaginary"],
} as const;
/** Semi-infinite Warburg Z=sigma(1-j)/sqrt(omega), explicitly defining the coefficient convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { warburgCoefficient, angularFrequency } = request;
  const compute = (): Output => {
    H.domain(warburgCoefficient >= 0);
    H.positive(angularFrequency);
    return {
      real: warburgCoefficient / Math.sqrt(angularFrequency),
      imaginary: -warburgCoefficient / Math.sqrt(angularFrequency),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { warburgCoefficient: 6, angularFrequency: 9 },
  output: { real: 2, imaginary: -2 },
} satisfies ToolExample<Input, Output>;
export const electrochemicalWarburgRealImaginaryPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/electrochemical-warburg-real-imaginary-pair",
      title: "Electrochemical Warburg Real Imaginary Pair Tool",
      description:
        "Semi-infinite Warburg Z=sigma(1-j)/sqrt(omega), explicitly defining the coefficient convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          warburgCoefficient: { type: "number", minimum: 0 },
          angularFrequency: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["warburgCoefficient", "angularFrequency"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { real: { type: "number" }, imaginary: { type: "number" } },
        required: ["real", "imaginary"],
      },
      ports: {
        inputs: [
          {
            id: "warburgCoefficient",
            label: "Warburg Coefficient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "angularFrequency",
            label: "Angular Frequency",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "real", label: "Real", valueType: { type: "number" } },
          {
            id: "imaginary",
            label: "Imaginary",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = electrochemicalWarburgRealImaginaryPairTool.execute;
export default electrochemicalWarburgRealImaginaryPairTool;
