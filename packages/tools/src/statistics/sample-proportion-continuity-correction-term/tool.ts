import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly successes: number;
  readonly count: number;
  readonly direction: number;
};
export type Output = { readonly corrected: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    successes: { type: "integer", minimum: 0 },
    count: { type: "integer", minimum: 1 },
    direction: { type: "integer" },
  },
  required: ["successes", "count", "direction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { corrected: { type: "number" } },
  required: ["corrected"],
} as const;
/** Calculate sample proportion continuity correction term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { successes, count, direction } = input;
  const compute = (): Output => {
    H.integer(count, 1);
    H.integer(successes, 0, count);
    H.domain(direction === -1 || direction === 1);
    return { corrected: (successes + 0.5 * direction) / count };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { successes: 5, count: 10, direction: 1 },
  output: { corrected: 0.55 },
} satisfies ToolExample<Input, Output>;
export const sampleProportionContinuityCorrectionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "statistics/sample-proportion-continuity-correction-term",
      title: "Sample Proportion Continuity Correction Term Tool",
      description:
        "Calculate sample proportion continuity correction term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          successes: { type: "integer", minimum: 0 },
          count: { type: "integer", minimum: 1 },
          direction: { type: "integer" },
        },
        required: ["successes", "count", "direction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { corrected: { type: "number" } },
        required: ["corrected"],
      },
      ports: {
        inputs: [
          {
            id: "successes",
            label: "Successes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "count",
            label: "Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "direction",
            label: "Direction",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "corrected",
            label: "Corrected",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sampleProportionContinuityCorrectionTermTool.execute;
export default sampleProportionContinuityCorrectionTermTool;
