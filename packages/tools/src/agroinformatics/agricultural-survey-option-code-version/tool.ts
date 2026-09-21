import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly code: string;
  readonly version: string;
  readonly allowedCodes: readonly string[];
  readonly expectedVersion: string;
};
export type Output = {
  readonly codeKnown: boolean;
  readonly versionMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
    allowedCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    expectedVersion: { type: "string", maxLength: 8192 },
  },
  required: ["code", "version", "allowedCodes", "expectedVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codeKnown: { type: "boolean" },
    versionMatches: { type: "boolean" },
  },
  required: ["codeKnown", "versionMatches"],
} as const;
/** Check supplied survey option codes without coercing leading zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code, version, allowedCodes, expectedVersion } = request;
  const compute = (): Output => {
    return {
      codeKnown: allowedCodes.includes(code),
      versionMatches: version === expectedVersion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    code: "02",
    version: "v2",
    allowedCodes: ["01", "02"],
    expectedVersion: "v2",
  },
  output: { codeKnown: true, versionMatches: true },
} satisfies ToolExample<Input, Output>;
export const agriculturalSurveyOptionCodeVersionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agroinformatics/agricultural-survey-option-code-version",
      title: "Agricultural Survey Option Code Version Tool",
      description:
        "Check supplied survey option codes without coercing leading zeros.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          code: { type: "string", maxLength: 8192 },
          version: { type: "string", maxLength: 8192 },
          allowedCodes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          expectedVersion: { type: "string", maxLength: 8192 },
        },
        required: ["code", "version", "allowedCodes", "expectedVersion"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          codeKnown: { type: "boolean" },
          versionMatches: { type: "boolean" },
        },
        required: ["codeKnown", "versionMatches"],
      },
      ports: {
        inputs: [
          {
            id: "code",
            label: "Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "version",
            label: "Version",
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
            id: "expectedVersion",
            label: "Expected Version",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "codeKnown",
            label: "Code Known",
            valueType: { type: "boolean" },
          },
          {
            id: "versionMatches",
            label: "Version Matches",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = agriculturalSurveyOptionCodeVersionTool.execute;
export default agriculturalSurveyOptionCodeVersionTool;
