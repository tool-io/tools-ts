import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseCode: string;
  readonly allowedCodes: readonly string[];
  readonly missingCode: string;
};
export type Output = {
  readonly recognized: boolean;
  readonly missing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseCode: { type: "string", maxLength: 8192 },
    allowedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingCode: { type: "string", maxLength: 8192 },
  },
  required: ["responseCode", "allowedCodes", "missingCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recognized: { type: "boolean" }, missing: { type: "boolean" } },
  required: ["recognized", "missing"],
} as const;
/** Compare a literal contact-frequency response with a supplied codebook and separate missing code. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseCode, allowedCodes, missingCode } = request;
  const compute = (): Output => {
    H.domain(!allowedCodes.includes(missingCode), "allowedCodes");
    return {
      recognized: allowedCodes.includes(responseCode),
      missing: responseCode === missingCode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    responseCode: "weekly",
    allowedCodes: ["daily", "weekly"],
    missingCode: "NA",
  },
  output: { recognized: true, missing: false },
} satisfies ToolExample<Input, Output>;
export const socialContactTieFrequencyCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gerontology", "health and medicine"],
      keywords: ["gerontology", "health and medicine"],
    },
    id: "gerontology/social-contact-tie-frequency-code",
    title: "Social Contact Tie Frequency Code",
    description:
      "Compare a literal contact-frequency response with a supplied codebook and separate missing code.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseCode: { type: "string", maxLength: 8192 },
        allowedCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingCode: { type: "string", maxLength: 8192 },
      },
      required: ["responseCode", "allowedCodes", "missingCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        missing: { type: "boolean" },
      },
      required: ["recognized", "missing"],
    },
    ports: {
      inputs: [
        {
          id: "responseCode",
          label: "Response Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedCodes",
          label: "Allowed Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingCode",
          label: "Missing Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "missing", label: "Missing", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = socialContactTieFrequencyCodeTool.execute;
export default socialContactTieFrequencyCodeTool;
