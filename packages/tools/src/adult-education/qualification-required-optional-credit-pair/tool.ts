import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredCredits: number;
  readonly optionalCredits: number;
};
export type Output = {
  readonly totalCredits: number;
  readonly optionalFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredCredits: { type: "number", minimum: 0 },
    optionalCredits: { type: "number", minimum: 0 },
  },
  required: ["requiredCredits", "optionalCredits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCredits: { type: "number" },
    optionalFraction: { type: "number" },
  },
  required: ["totalCredits", "optionalFraction"],
} as const;
/** Combine explicit required and optional credit values, allowing fractional credits and defining optional fraction as zero for an empty total. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredCredits, optionalCredits } = request;
  const compute = (): Output => {
    H.domain(requiredCredits >= 0, "requiredCredits");
    H.domain(optionalCredits >= 0, "optionalCredits");
    const totalCredits = requiredCredits + optionalCredits;
    return {
      totalCredits,
      optionalFraction: totalCredits === 0 ? 0 : optionalCredits / totalCredits,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredCredits: 90, optionalCredits: 30 },
  output: { totalCredits: 120, optionalFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const qualificationRequiredOptionalCreditPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["adult-education", "adult education", "education"],
        keywords: ["adult education", "education"],
      },
      id: "adult-education/qualification-required-optional-credit-pair",
      title: "Qualification Required Optional Credit Pair",
      description:
        "Combine explicit required and optional credit values, allowing fractional credits and defining optional fraction as zero for an empty total.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requiredCredits: { type: "number", minimum: 0 },
          optionalCredits: { type: "number", minimum: 0 },
        },
        required: ["requiredCredits", "optionalCredits"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalCredits: { type: "number" },
          optionalFraction: { type: "number" },
        },
        required: ["totalCredits", "optionalFraction"],
      },
      ports: {
        inputs: [
          {
            id: "requiredCredits",
            label: "Required Credits",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "optionalCredits",
            label: "Optional Credits",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "totalCredits",
            label: "Total Credits",
            valueType: { type: "number" },
          },
          {
            id: "optionalFraction",
            label: "Optional Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = qualificationRequiredOptionalCreditPairTool.execute;
export default qualificationRequiredOptionalCreditPairTool;
