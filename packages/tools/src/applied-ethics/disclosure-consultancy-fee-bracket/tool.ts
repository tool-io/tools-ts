import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feeAmount: number;
  readonly lowerInclusive: number;
  readonly upperExclusive: number;
};
export type Output = { readonly withinBracket: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feeAmount: { type: "number", minimum: 0 },
    lowerInclusive: { type: "number", minimum: 0 },
    upperExclusive: { type: "number" },
  },
  required: ["feeAmount", "lowerInclusive", "upperExclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { withinBracket: { type: "boolean" } },
  required: ["withinBracket"],
} as const;
/** Check a supplied consultancy fee against explicitly supplied half-open disclosure brackets without selecting policy thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feeAmount, lowerInclusive, upperExclusive } = request;
  const compute = (): Output => {
    H.domain(feeAmount >= 0, "feeAmount");
    H.domain(lowerInclusive >= 0, "lowerInclusive");
    H.domain(upperExclusive > lowerInclusive, "upperExclusive");
    return {
      withinBracket: feeAmount >= lowerInclusive && feeAmount < upperExclusive,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { feeAmount: 750, lowerInclusive: 500, upperExclusive: 1000 },
  output: { withinBracket: true },
} satisfies ToolExample<Input, Output>;
export const disclosureConsultancyFeeBracketTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/disclosure-consultancy-fee-bracket",
    title: "Disclosure Consultancy Fee Bracket",
    description:
      "Check a supplied consultancy fee against explicitly supplied half-open disclosure brackets without selecting policy thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feeAmount: { type: "number", minimum: 0 },
        lowerInclusive: { type: "number", minimum: 0 },
        upperExclusive: { type: "number" },
      },
      required: ["feeAmount", "lowerInclusive", "upperExclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { withinBracket: { type: "boolean" } },
      required: ["withinBracket"],
    },
    ports: {
      inputs: [
        {
          id: "feeAmount",
          label: "Fee Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerInclusive",
          label: "Lower Inclusive",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperExclusive",
          label: "Upper Exclusive",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "withinBracket",
          label: "Within Bracket",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = disclosureConsultancyFeeBracketTool.execute;
export default disclosureConsultancyFeeBracketTool;
