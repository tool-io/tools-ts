import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly parameter: number };
export type Output = {
  readonly leftWeight: number;
  readonly rightWeight: number;
  readonly amplification: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { parameter: { type: "number" } },
  required: ["parameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftWeight: { type: "number" },
    rightWeight: { type: "number" },
    amplification: { type: "number" },
  },
  required: ["leftWeight", "rightWeight", "amplification"],
} as const;
/** Calculate linear extrapolation horizon amplification from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { parameter } = input;
  const compute = (): Output => {
    return {
      leftWeight: 1 - parameter,
      rightWeight: parameter,
      amplification: Math.abs(1 - parameter) + Math.abs(parameter),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { parameter: 2 },
  output: { leftWeight: -1, rightWeight: 2, amplification: 3 },
} satisfies ToolExample<Input, Output>;
export const linearExtrapolationHorizonAmplificationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/linear-extrapolation-horizon-amplification",
      title: "Linear Extrapolation Horizon Amplification Tool",
      description:
        "Calculate linear extrapolation horizon amplification from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { parameter: { type: "number" } },
        required: ["parameter"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leftWeight: { type: "number" },
          rightWeight: { type: "number" },
          amplification: { type: "number" },
        },
        required: ["leftWeight", "rightWeight", "amplification"],
      },
      ports: {
        inputs: [
          {
            id: "parameter",
            label: "Parameter",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "leftWeight",
            label: "Left Weight",
            valueType: { type: "number" },
          },
          {
            id: "rightWeight",
            label: "Right Weight",
            valueType: { type: "number" },
          },
          {
            id: "amplification",
            label: "Amplification",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = linearExtrapolationHorizonAmplificationTool.execute;
export default linearExtrapolationHorizonAmplificationTool;
