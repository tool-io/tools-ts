import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positive: number;
  readonly negative: number;
  readonly abstained: number;
};
export type Output = {
  readonly accepted: number;
  readonly total: number;
  readonly coverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positive: { type: "integer" },
    negative: { type: "integer" },
    abstained: { type: "integer" },
  },
  required: ["positive", "negative", "abstained"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accepted: { type: "integer" },
    total: { type: "integer" },
    coverage: { type: "number" },
  },
  required: ["accepted", "total", "coverage"],
} as const;
/** Calculate binary abstention coverage count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { positive, negative, abstained } = request;
  const compute = (): Output => {
    for (const x of [positive, negative, abstained]) H.integer(x, 0);
    const accepted = positive + negative,
      total = accepted + abstained;
    H.positive(total);
    return { accepted, total, coverage: accepted / total };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { positive: 30, negative: 50, abstained: 20 },
  output: { accepted: 80, total: 100, coverage: 0.8 },
} satisfies ToolExample<Input, Output>;
export const binaryAbstentionCoverageCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/binary-abstention-coverage-count",
    title: "Binary Abstention Coverage Count Tool",
    description:
      "Calculate binary abstention coverage count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positive: { type: "integer" },
        negative: { type: "integer" },
        abstained: { type: "integer" },
      },
      required: ["positive", "negative", "abstained"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accepted: { type: "integer" },
        total: { type: "integer" },
        coverage: { type: "number" },
      },
      required: ["accepted", "total", "coverage"],
    },
    ports: {
      inputs: [
        {
          id: "positive",
          label: "Positive",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "negative",
          label: "Negative",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "abstained",
          label: "Abstained",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "accepted", label: "Accepted", valueType: { type: "integer" } },
        { id: "total", label: "Total", valueType: { type: "integer" } },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = binaryAbstentionCoverageCountTool.execute;
export default binaryAbstentionCoverageCountTool;
