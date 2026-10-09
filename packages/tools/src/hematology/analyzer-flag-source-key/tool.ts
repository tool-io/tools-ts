import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly analyzerId: string;
  readonly flagCode: string;
  readonly softwareVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analyzerId: { type: "string", maxLength: 8192, minLength: 1 },
    flagCode: { type: "string", maxLength: 8192, minLength: 1 },
    softwareVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["analyzerId", "flagCode", "softwareVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a literal analyzer flag code by instrument and software version without interpreting the flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { analyzerId, flagCode, softwareVersion } = request;
  const compute = (): Output => {
    H.domain(analyzerId.length > 0, "analyzerId");
    H.domain(flagCode.length > 0, "flagCode");
    H.domain(softwareVersion.length > 0, "softwareVersion");
    return { token: JSON.stringify([analyzerId, flagCode, softwareVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { analyzerId: "AN17", flagCode: "FLAG-A", softwareVersion: "v3" },
  output: { token: '["AN17","FLAG-A","v3"]' },
} satisfies ToolExample<Input, Output>;
export const analyzerFlagSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hematology", "health and medicine"],
      keywords: ["hematology", "health and medicine"],
    },
    id: "hematology/analyzer-flag-source-key",
    title: "Analyzer Flag Source Key",
    description:
      "Qualify a literal analyzer flag code by instrument and software version without interpreting the flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        analyzerId: { type: "string", maxLength: 8192, minLength: 1 },
        flagCode: { type: "string", maxLength: 8192, minLength: 1 },
        softwareVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["analyzerId", "flagCode", "softwareVersion"],
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
          id: "analyzerId",
          label: "Analyzer Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "flagCode",
          label: "Flag Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "softwareVersion",
          label: "Software Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = analyzerFlagSourceKeyTool.execute;
export default analyzerFlagSourceKeyTool;
