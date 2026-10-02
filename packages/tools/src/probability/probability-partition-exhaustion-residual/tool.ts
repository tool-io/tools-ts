import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probabilities: readonly number[] };
export type Output = { readonly total: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["probabilities"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { total: { type: "number" }, residual: { type: "number" } },
  required: ["total", "residual"],
} as const;
/** Calculate probability partition exhaustion residual from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { probabilities } = input;
  const compute = (): Output => {
    probabilities.forEach((x) => H.probability(x));
    const total = probabilities.reduce((a, b) => a + b, 0);
    return { total, residual: 1 - total };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { probabilities: [0.25, 0.5] },
  output: { total: 0.75, residual: 0.25 },
} satisfies ToolExample<Input, Output>;
export const probabilityPartitionExhaustionResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "probability/probability-partition-exhaustion-residual",
      title: "Probability Partition Exhaustion Residual Tool",
      description:
        "Calculate probability partition exhaustion residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          probabilities: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["probabilities"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { total: { type: "number" }, residual: { type: "number" } },
        required: ["total", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "probabilities",
            label: "Probabilities",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          { id: "total", label: "Total", valueType: { type: "number" } },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = probabilityPartitionExhaustionResidualTool.execute;
export default probabilityPartitionExhaustionResidualTool;
