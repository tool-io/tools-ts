import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly quality: number };
export type Output = {
  readonly errorProbability: number;
  readonly errorOdds: number;
  readonly oddsDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { quality: { type: "number", minimum: 0 } },
  required: ["quality"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    errorProbability: { type: "number" },
    errorOdds: { type: "number" },
    oddsDefined: { type: "boolean" },
  },
  required: ["errorProbability", "errorOdds", "oddsDefined"],
} as const;
/** Convert a supplied Phred score to error probability and finite error odds, preserving the Q=0 undefined-odds flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quality } = request;
  const compute = (): Output => {
    H.domain(quality >= 0);
    const errorProbability = 10 ** (-quality / 10),
      errorOdds =
        quality === 0
          ? 0
          : errorProbability <= 0.5
            ? errorProbability / (1 - errorProbability)
            : 1 / Math.expm1((quality * Math.LN10) / 10);
    return { errorProbability, errorOdds, oddsDefined: quality > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quality: 20 },
  output: {
    errorProbability: 0.01,
    errorOdds: 0.010101010101010102,
    oddsDefined: true,
  },
} satisfies ToolExample<Input, Output>;
export const phredErrorOddsTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "bioinformatics/phred-error-odds",
    title: "Phred Error Odds Tool",
    description:
      "Convert a supplied Phred score to error probability and finite error odds, preserving the Q=0 undefined-odds flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { quality: { type: "number", minimum: 0 } },
      required: ["quality"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        errorProbability: { type: "number" },
        errorOdds: { type: "number" },
        oddsDefined: { type: "boolean" },
      },
      required: ["errorProbability", "errorOdds", "oddsDefined"],
    },
    ports: {
      inputs: [
        {
          id: "quality",
          label: "Quality",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "errorProbability",
          label: "Error Probability",
          valueType: { type: "number" },
        },
        { id: "errorOdds", label: "Error Odds", valueType: { type: "number" } },
        {
          id: "oddsDefined",
          label: "Odds Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = phredErrorOddsTool.execute;
export default phredErrorOddsTool;
