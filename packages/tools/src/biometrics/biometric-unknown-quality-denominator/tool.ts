import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly accepted: number;
  readonly rejected: number;
  readonly unknown: number;
  readonly countUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly acceptedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accepted: { type: "integer", minimum: 0 },
    rejected: { type: "integer", minimum: 0 },
    unknown: { type: "integer", minimum: 0 },
    countUnknown: { type: "boolean" },
  },
  required: ["accepted", "rejected", "unknown", "countUnknown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    acceptedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "acceptedShare", "defined"],
} as const;
/** Quality-label denominator bookkeeping without processing biometric samples. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accepted, rejected, unknown, countUnknown } = request;
  const compute = (): Output => {
    H.integer(accepted, 0);
    H.integer(rejected, 0);
    H.integer(unknown, 0);
    return {
      denominator: accepted + rejected + (countUnknown ? unknown : 0),
      acceptedShare:
        accepted + rejected + (countUnknown ? unknown : 0) > 0
          ? accepted / (accepted + rejected + (countUnknown ? unknown : 0))
          : 0,
      defined: accepted + rejected + (countUnknown ? unknown : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { accepted: 70, rejected: 20, unknown: 10, countUnknown: true },
  output: { denominator: 100, acceptedShare: 0.7, defined: true },
} satisfies ToolExample<Input, Output>;
export const biometricUnknownQualityDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/biometric-unknown-quality-denominator",
    title: "Biometric Unknown Quality Denominator Tool",
    description:
      "Quality-label denominator bookkeeping without processing biometric samples.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accepted: { type: "integer", minimum: 0 },
        rejected: { type: "integer", minimum: 0 },
        unknown: { type: "integer", minimum: 0 },
        countUnknown: { type: "boolean" },
      },
      required: ["accepted", "rejected", "unknown", "countUnknown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        acceptedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "acceptedShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "accepted",
          label: "Accepted",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rejected",
          label: "Rejected",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknown",
          label: "Unknown",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countUnknown",
          label: "Count Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "acceptedShare",
          label: "Accepted Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = biometricUnknownQualityDenominatorTool.execute;
export default biometricUnknownQualityDenominatorTool;
