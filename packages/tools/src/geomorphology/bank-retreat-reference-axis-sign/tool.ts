import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earlierPosition: number;
  readonly laterPosition: number;
  readonly retreatPositiveSign: number;
  readonly elapsedYears: number;
};
export type Output = {
  readonly signedRetreat: number;
  readonly annualRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earlierPosition: { type: "number" },
    laterPosition: { type: "number" },
    retreatPositiveSign: { type: "integer" },
    elapsedYears: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "earlierPosition",
    "laterPosition",
    "retreatPositiveSign",
    "elapsedYears",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedRetreat: { type: "number" },
    annualRate: { type: "number" },
  },
  required: ["signedRetreat", "annualRate"],
} as const;
/** Calculate bank retreat reference axis sign from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earlierPosition, laterPosition, retreatPositiveSign, elapsedYears } =
    request;
  const compute = (): Output => {
    H.domain([1, -1].includes(retreatPositiveSign));
    H.positive(elapsedYears);
    return {
      signedRetreat: (laterPosition - earlierPosition) * retreatPositiveSign,
      annualRate:
        ((laterPosition - earlierPosition) * retreatPositiveSign) /
        elapsedYears,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    earlierPosition: 10,
    laterPosition: 7,
    retreatPositiveSign: -1,
    elapsedYears: 3,
  },
  output: { signedRetreat: 3, annualRate: 1 },
} satisfies ToolExample<Input, Output>;
export const bankRetreatReferenceAxisSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geomorphology/bank-retreat-reference-axis-sign",
    title: "Bank Retreat Reference Axis Sign Tool",
    description:
      "Calculate bank retreat reference axis sign from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earlierPosition: { type: "number" },
        laterPosition: { type: "number" },
        retreatPositiveSign: { type: "integer" },
        elapsedYears: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "earlierPosition",
        "laterPosition",
        "retreatPositiveSign",
        "elapsedYears",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedRetreat: { type: "number" },
        annualRate: { type: "number" },
      },
      required: ["signedRetreat", "annualRate"],
    },
    ports: {
      inputs: [
        {
          id: "earlierPosition",
          label: "Earlier Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "laterPosition",
          label: "Later Position",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retreatPositiveSign",
          label: "Retreat Positive Sign",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "elapsedYears",
          label: "Elapsed Years",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedRetreat",
          label: "Signed Retreat",
          valueType: { type: "number" },
        },
        {
          id: "annualRate",
          label: "Annual Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bankRetreatReferenceAxisSignTool.execute;
export default bankRetreatReferenceAxisSignTool;
