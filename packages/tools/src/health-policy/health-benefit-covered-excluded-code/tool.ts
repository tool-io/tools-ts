import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedCode: string;
  readonly coveredCodes: readonly string[];
  readonly excludedCodes: readonly string[];
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedCode: { type: "string", maxLength: 8192 },
    coveredCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    excludedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["recordedCode", "coveredCodes", "excludedCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Check a literal benefit code against supplied disjoint covered and excluded lists without adjudicating a claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedCode, coveredCodes, excludedCodes } = request;
  const compute = (): Output => {
    H.domain(
      !coveredCodes.some((x) => excludedCodes.includes(x)),
      "excludedCodes",
    );
    return {
      status: coveredCodes.includes(recordedCode)
        ? "listed-covered"
        : excludedCodes.includes(recordedCode)
          ? "listed-excluded"
          : "unlisted",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedCode: "A", coveredCodes: ["A"], excludedCodes: ["B"] },
  output: { status: "listed-covered" },
} satisfies ToolExample<Input, Output>;
export const healthBenefitCoveredExcludedCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["health-policy", "health policy", "social sciences"],
      keywords: ["health policy", "social sciences"],
    },
    id: "health-policy/health-benefit-covered-excluded-code",
    title: "Health Benefit Covered Excluded Code",
    description:
      "Check a literal benefit code against supplied disjoint covered and excluded lists without adjudicating a claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedCode: { type: "string", maxLength: 8192 },
        coveredCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        excludedCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["recordedCode", "coveredCodes", "excludedCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "recordedCode",
          label: "Recorded Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "coveredCodes",
          label: "Covered Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "excludedCodes",
          label: "Excluded Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = healthBenefitCoveredExcludedCodeTool.execute;
export default healthBenefitCoveredExcludedCodeTool;
