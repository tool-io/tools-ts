import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalAmount: number;
  readonly measuredPurityFraction: number;
};
export type Output = {
  readonly pureAmount: number;
  readonly correctionFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalAmount: { type: "number", minimum: 0 },
    measuredPurityFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["nominalAmount", "measuredPurityFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pureAmount: { type: "number" },
    correctionFactor: { type: "number" },
  },
  required: ["pureAmount", "correctionFactor"],
} as const;
/** Apply a measured positive purity fraction to a nominal amount and report its reciprocal correction factor without estimating purity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalAmount, measuredPurityFraction } = request;
  const compute = (): Output => {
    H.domain(nominalAmount >= 0, "nominalAmount");
    H.domain(
      measuredPurityFraction > 0 && measuredPurityFraction <= 1,
      "measuredPurityFraction",
    );
    return {
      pureAmount: nominalAmount * measuredPurityFraction,
      correctionFactor: 1 / measuredPurityFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nominalAmount: 20, measuredPurityFraction: 0.8 },
  output: { pureAmount: 16, correctionFactor: 1.25 },
} satisfies ToolExample<Input, Output>;
export const assayPurityCorrectionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/assay-purity-correction-factor",
    title: "Assay Purity Correction Factor",
    description:
      "Apply a measured positive purity fraction to a nominal amount and report its reciprocal correction factor without estimating purity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalAmount: { type: "number", minimum: 0 },
        measuredPurityFraction: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: ["nominalAmount", "measuredPurityFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pureAmount: { type: "number" },
        correctionFactor: { type: "number" },
      },
      required: ["pureAmount", "correctionFactor"],
    },
    ports: {
      inputs: [
        {
          id: "nominalAmount",
          label: "Nominal Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredPurityFraction",
          label: "Measured Purity Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pureAmount",
          label: "Pure Amount",
          valueType: { type: "number" },
        },
        {
          id: "correctionFactor",
          label: "Correction Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assayPurityCorrectionFactorTool.execute;
export default assayPurityCorrectionFactorTool;
