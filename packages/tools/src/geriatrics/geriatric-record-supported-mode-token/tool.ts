import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mode: string;
  readonly permittedModes: readonly string[];
  readonly assistanceRecorded: boolean;
  readonly requiresAssistance: boolean;
};
export type Output = {
  readonly modeRecognized: boolean;
  readonly flagsConsistent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mode: { type: "string", maxLength: 8192 },
    permittedModes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    assistanceRecorded: { type: "boolean" },
    requiresAssistance: { type: "boolean" },
  },
  required: [
    "mode",
    "permittedModes",
    "assistanceRecorded",
    "requiresAssistance",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modeRecognized: { type: "boolean" },
    flagsConsistent: { type: "boolean" },
  },
  required: ["modeRecognized", "flagsConsistent"],
} as const;
/** Audit supplied recording-mode and assistance metadata without inferring ability or consent authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mode, permittedModes, assistanceRecorded, requiresAssistance } =
    request;
  const compute = (): Output => {
    return {
      modeRecognized: permittedModes.includes(mode),
      flagsConsistent: !requiresAssistance || assistanceRecorded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    mode: "verbal",
    permittedModes: ["verbal", "written"],
    assistanceRecorded: true,
    requiresAssistance: true,
  },
  output: { modeRecognized: true, flagsConsistent: true },
} satisfies ToolExample<Input, Output>;
export const geriatricRecordSupportedModeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/geriatric-record-supported-mode-token",
    title: "Geriatric Record Supported Mode Token Tool",
    description:
      "Audit supplied recording-mode and assistance metadata without inferring ability or consent authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mode: { type: "string", maxLength: 8192 },
        permittedModes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        assistanceRecorded: { type: "boolean" },
        requiresAssistance: { type: "boolean" },
      },
      required: [
        "mode",
        "permittedModes",
        "assistanceRecorded",
        "requiresAssistance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modeRecognized: { type: "boolean" },
        flagsConsistent: { type: "boolean" },
      },
      required: ["modeRecognized", "flagsConsistent"],
    },
    ports: {
      inputs: [
        {
          id: "mode",
          label: "Mode",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permittedModes",
          label: "Permitted Modes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "assistanceRecorded",
          label: "Assistance Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "requiresAssistance",
          label: "Requires Assistance",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "modeRecognized",
          label: "Mode Recognized",
          valueType: { type: "boolean" },
        },
        {
          id: "flagsConsistent",
          label: "Flags Consistent",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = geriatricRecordSupportedModeTokenTool.execute;
export default geriatricRecordSupportedModeTokenTool;
