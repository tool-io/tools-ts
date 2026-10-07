import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly meanNegativeLogLikelihood: number;
  readonly logarithmBase: number;
};
export type Output = {
  readonly perplexity: number;
  readonly natsPerToken: number;
  readonly bitsPerToken: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanNegativeLogLikelihood: { type: "number", minimum: 0 },
    logarithmBase: { type: "number", exclusiveMinimum: 1 },
  },
  required: ["meanNegativeLogLikelihood", "logarithmBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perplexity: { type: "number" },
    natsPerToken: { type: "number" },
    bitsPerToken: { type: "number" },
  },
  required: ["perplexity", "natsPerToken", "bitsPerToken"],
} as const;
/** Convert explicit mean negative log-likelihood between logarithm bases and perplexity without scoring a language model or changing tokenization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { meanNegativeLogLikelihood, logarithmBase } = request;
  const compute = (): Output => {
    H.domain(
      meanNegativeLogLikelihood >= 0 && logarithmBase > 1,
      "meanNegativeLogLikelihood",
    );
    return {
      perplexity: Math.exp(meanNegativeLogLikelihood * Math.log(logarithmBase)),
      natsPerToken: meanNegativeLogLikelihood * Math.log(logarithmBase),
      bitsPerToken:
        (meanNegativeLogLikelihood * Math.log(logarithmBase)) / Math.LN2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { meanNegativeLogLikelihood: 3, logarithmBase: 2 },
  output: {
    perplexity: 7.999999999999998,
    natsPerToken: 2.0794415416798357,
    bitsPerToken: 3,
  },
} satisfies ToolExample<Input, Output>;
export const languageModelLogBasePerplexityCrosswalkTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "computational-linguistics",
          "computational linguistics",
          "information and language sciences",
        ],
        keywords: [
          "computational linguistics",
          "information and language sciences",
        ],
      },
      id: "computational-linguistics/language-model-log-base-perplexity-crosswalk",
      title: "Language Model Log Base Perplexity Crosswalk",
      description:
        "Convert explicit mean negative log-likelihood between logarithm bases and perplexity without scoring a language model or changing tokenization.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          meanNegativeLogLikelihood: { type: "number", minimum: 0 },
          logarithmBase: { type: "number", exclusiveMinimum: 1 },
        },
        required: ["meanNegativeLogLikelihood", "logarithmBase"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          perplexity: { type: "number" },
          natsPerToken: { type: "number" },
          bitsPerToken: { type: "number" },
        },
        required: ["perplexity", "natsPerToken", "bitsPerToken"],
      },
      ports: {
        inputs: [
          {
            id: "meanNegativeLogLikelihood",
            label: "Mean Negative Log Likelihood",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "logarithmBase",
            label: "Logarithm Base",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "perplexity",
            label: "Perplexity",
            valueType: { type: "number" },
          },
          {
            id: "natsPerToken",
            label: "Nats Per Token",
            valueType: { type: "number" },
          },
          {
            id: "bitsPerToken",
            label: "Bits Per Token",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = languageModelLogBasePerplexityCrosswalkTool.execute;
export default languageModelLogBasePerplexityCrosswalkTool;
