import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly perplexities: readonly number[];
  readonly weights: readonly number[];
};
export type Output = {
  readonly logPerplexity: number;
  readonly perplexity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perplexities: { type: "array", maxItems: 256, items: { type: "number" } },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["perplexities", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logPerplexity: { type: "number" },
    perplexity: { type: "number" },
  },
  required: ["logPerplexity", "perplexity"],
} as const;
/** Calculate perplexity mixture log average term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { perplexities, weights } = request;
  const compute = (): Output => {
    H.sameLength(perplexities, weights);
    H.domain(
      perplexities.length > 0 &&
        perplexities.every((x) => x > 0) &&
        weights.every((x) => x >= 0),
    );
    const total = weights.reduce((a, b) => a + b, 0);
    H.positive(total);
    const logPerplexity =
      H.dot(
        perplexities.map((x) => Math.log(x)),
        weights,
      ) / total;
    return { logPerplexity, perplexity: Math.exp(logPerplexity) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { perplexities: [2, 8], weights: [1, 1] },
  output: { logPerplexity: 1.3862943611198906, perplexity: 4 },
} satisfies ToolExample<Input, Output>;
export const perplexityMixtureLogAverageTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information/perplexity-mixture-log-average-term",
    title: "Perplexity Mixture Log Average Term Tool",
    description:
      "Calculate perplexity mixture log average term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perplexities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["perplexities", "weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logPerplexity: { type: "number" },
        perplexity: { type: "number" },
      },
      required: ["logPerplexity", "perplexity"],
    },
    ports: {
      inputs: [
        {
          id: "perplexities",
          label: "Perplexities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "logPerplexity",
          label: "Log Perplexity",
          valueType: { type: "number" },
        },
        {
          id: "perplexity",
          label: "Perplexity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = perplexityMixtureLogAverageTermTool.execute;
export default perplexityMixtureLogAverageTermTool;
