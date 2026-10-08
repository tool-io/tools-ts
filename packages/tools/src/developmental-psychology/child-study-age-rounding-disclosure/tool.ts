import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedAgeText: string;
  readonly roundingConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAgeText: { type: "string", maxLength: 8192, minLength: 1 },
    roundingConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedAgeText", "roundingConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit child-study age transcription and supplied rounding convention without inferring birth dates or development. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedAgeText, roundingConvention } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedAgeText.length > 0, "suppliedAgeText");
    H.domain(roundingConvention.length > 0, "roundingConvention");
    return {
      token: JSON.stringify([recordId, suppliedAgeText, roundingConvention]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedAgeText: "24 months",
    roundingConvention: "nearest whole month",
  },
  output: { token: '["R17","24 months","nearest whole month"]' },
} satisfies ToolExample<Input, Output>;
export const childStudyAgeRoundingDisclosureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/child-study-age-rounding-disclosure",
    title: "Child Study Age Rounding Disclosure Tool",
    description:
      "Preserve an explicit child-study age transcription and supplied rounding convention without inferring birth dates or development.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAgeText: { type: "string", maxLength: 8192, minLength: 1 },
        roundingConvention: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedAgeText", "roundingConvention"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAgeText",
          label: "Supplied Age Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "roundingConvention",
          label: "Rounding Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = childStudyAgeRoundingDisclosureTool.execute;
export default childStudyAgeRoundingDisclosureTool;
