import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedCode: string;
  readonly missingCodes: readonly string[];
  readonly refusedCodes: readonly string[];
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedCode: { type: "string", maxLength: 8192 },
    missingCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    refusedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["recordedCode", "missingCodes", "refusedCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Separate explicitly supplied refusal and missing response codes without imputing survey answers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedCode, missingCodes, refusedCodes } = request;
  const compute = (): Output => {
    H.domain(
      !missingCodes.some((x) => refusedCodes.includes(x)),
      "refusedCodes",
    );
    return {
      status: missingCodes.includes(recordedCode)
        ? "missing"
        : refusedCodes.includes(recordedCode)
          ? "refused"
          : "other",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedCode: "R", missingCodes: ["M"], refusedCodes: ["R"] },
  output: { status: "refused" },
} satisfies ToolExample<Input, Output>;
export const healthSurveyNonresponseCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["public-health", "public health", "health and medicine"],
      keywords: ["public health", "health and medicine"],
    },
    id: "public-health/health-survey-nonresponse-code",
    title: "Health Survey Nonresponse Code",
    description:
      "Separate explicitly supplied refusal and missing response codes without imputing survey answers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedCode: { type: "string", maxLength: 8192 },
        missingCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        refusedCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["recordedCode", "missingCodes", "refusedCodes"],
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
          id: "missingCodes",
          label: "Missing Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "refusedCodes",
          label: "Refused Codes",
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
export const run = healthSurveyNonresponseCodeTool.execute;
export default healthSurveyNonresponseCodeTool;
