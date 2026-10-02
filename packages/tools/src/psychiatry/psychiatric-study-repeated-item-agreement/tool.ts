import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstResponses: readonly number[];
  readonly secondResponses: readonly number[];
  readonly tolerance: number;
};
export type Output = {
  readonly matched: number;
  readonly compared: number;
  readonly agreementFraction: number;
  readonly meanSignedDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstResponses: { type: "array", maxItems: 256, items: { type: "number" } },
    secondResponses: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["firstResponses", "secondResponses", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matched: { type: "integer" },
    compared: { type: "integer" },
    agreementFraction: { type: "number" },
    meanSignedDifference: { type: "number" },
  },
  required: [
    "matched",
    "compared",
    "agreementFraction",
    "meanSignedDifference",
  ],
} as const;
/** Paired supplied item agreement under an explicit numerical tolerance, without questionnaire-specific reliability or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstResponses, secondResponses, tolerance } = request;
  const compute = (): Output => {
    H.sameLength(firstResponses, secondResponses);
    H.domain(firstResponses.length > 0 && tolerance >= 0);
    return {
      matched: firstResponses.filter(
        (x, i) => Math.abs(x - secondResponses[i]) <= tolerance,
      ).length,
      compared: firstResponses.length,
      agreementFraction:
        firstResponses.filter(
          (x, i) => Math.abs(x - secondResponses[i]) <= tolerance,
        ).length / firstResponses.length,
      meanSignedDifference:
        firstResponses.reduce((a, b, i) => a + secondResponses[i] - b, 0) /
        firstResponses.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstResponses: [1, 2, 4],
    secondResponses: [1, 3, 4],
    tolerance: 0,
  },
  output: {
    matched: 2,
    compared: 3,
    agreementFraction: 0.6666666666666666,
    meanSignedDifference: 0.3333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const psychiatricStudyRepeatedItemAgreementTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "psychiatry/psychiatric-study-repeated-item-agreement",
      title: "Psychiatric Study Repeated Item Agreement Tool",
      description:
        "Paired supplied item agreement under an explicit numerical tolerance, without questionnaire-specific reliability or clinical interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstResponses: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          secondResponses: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["firstResponses", "secondResponses", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          matched: { type: "integer" },
          compared: { type: "integer" },
          agreementFraction: { type: "number" },
          meanSignedDifference: { type: "number" },
        },
        required: [
          "matched",
          "compared",
          "agreementFraction",
          "meanSignedDifference",
        ],
      },
      ports: {
        inputs: [
          {
            id: "firstResponses",
            label: "First Responses",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "secondResponses",
            label: "Second Responses",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "tolerance",
            label: "Tolerance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "matched", label: "Matched", valueType: { type: "integer" } },
          { id: "compared", label: "Compared", valueType: { type: "integer" } },
          {
            id: "agreementFraction",
            label: "Agreement Fraction",
            valueType: { type: "number" },
          },
          {
            id: "meanSignedDifference",
            label: "Mean Signed Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = psychiatricStudyRepeatedItemAgreementTool.execute;
export default psychiatricStudyRepeatedItemAgreementTool;
