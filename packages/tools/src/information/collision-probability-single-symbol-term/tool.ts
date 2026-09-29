import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number };
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { probability: { type: "number", minimum: 0, maximum: 1 } },
  required: ["probability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate collision probability single symbol term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { probability } = input;
  const compute = (): Output => {
    H.probability(probability);
    return { contribution: probability * probability };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { probability: 0.25 },
  output: { contribution: 0.0625 },
} satisfies ToolExample<Input, Output>;
export const collisionProbabilitySingleSymbolTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information/collision-probability-single-symbol-term",
      title: "Collision Probability Single Symbol Term Tool",
      description:
        "Calculate collision probability single symbol term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { probability: { type: "number", minimum: 0, maximum: 1 } },
        required: ["probability"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { contribution: { type: "number" } },
        required: ["contribution"],
      },
      ports: {
        inputs: [
          {
            id: "probability",
            label: "Probability",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "contribution",
            label: "Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = collisionProbabilitySingleSymbolTermTool.execute;
export default collisionProbabilitySingleSymbolTermTool;
