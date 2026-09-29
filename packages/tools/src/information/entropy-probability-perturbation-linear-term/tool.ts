import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number; readonly delta: number };
export type Output = { readonly bitsChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: {
      type: "number",
      exclusiveMinimum: 0,
      minimum: 0,
      maximum: 1,
    },
    delta: { type: "number" },
  },
  required: ["probability", "delta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bitsChange: { type: "number" } },
  required: ["bitsChange"],
} as const;
/** Calculate entropy probability perturbation linear term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { probability, delta } = input;
  const compute = (): Output => {
    H.probability(probability);
    H.positive(probability);
    return { bitsChange: -(Math.log2(probability) + 1 / Math.LN2) * delta };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { probability: 0.5, delta: 0.1 },
  output: { bitsChange: -0.04426950408889634 },
} satisfies ToolExample<Input, Output>;
export const entropyProbabilityPerturbationLinearTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information/entropy-probability-perturbation-linear-term",
      title: "Entropy Probability Perturbation Linear Term Tool",
      description:
        "Calculate entropy probability perturbation linear term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          probability: {
            type: "number",
            exclusiveMinimum: 0,
            minimum: 0,
            maximum: 1,
          },
          delta: { type: "number" },
        },
        required: ["probability", "delta"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { bitsChange: { type: "number" } },
        required: ["bitsChange"],
      },
      ports: {
        inputs: [
          {
            id: "probability",
            label: "Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "delta",
            label: "Delta",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "bitsChange",
            label: "Bits Change",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = entropyProbabilityPerturbationLinearTermTool.execute;
export default entropyProbabilityPerturbationLinearTermTool;
