import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { isRecord, uuidRegex } from "../../uuid/shared.js";

export type ValidateUuidInput = { readonly uuid: string };
export type ValidateUuidOutput = {
  readonly normalized: string;
  readonly valid: boolean;
  readonly version: number;
};

export const calculateValidateUuid = (input: unknown): ToolResult<ValidateUuidOutput> => {
  if (!isRecord(input) || typeof input.uuid !== "string")
    return invalidInput([{ code: "uuid_required", field: "uuid", message: "UUID text is required." }]);
  if (Object.keys(input).some((field) => field !== "uuid"))
    return invalidInput([{ code: "unknown_field", field: "", message: "Only uuid is supported." }]);
  const valid = uuidRegex.test(input.uuid);
  const normalized = valid ? input.uuid.toLowerCase() : "";
  return toolSuccess({
    normalized,
    valid,
    version: valid ? Number.parseInt(normalized[14]!, 16) : 0,
  });
};

export const example = {
  input: { uuid: "550e8400-e29b-41d4-a716-446655440000" },
  output: {
    normalized: "550e8400-e29b-41d4-a716-446655440000",
    valid: true,
    version: 4,
  },
} satisfies ToolExample<ValidateUuidInput, ValidateUuidOutput>;

export const validateUuidTool = defineTool<ValidateUuidInput, ValidateUuidOutput>({
  contractVersion: 1,
  description: "Check whether text uses the canonical UUID hexadecimal and hyphen layout, then report its version nibble.",
  discovery: {
    aliases: ["guid validator", "uuid checker", "uuid validator"],
    keywords: ["guid", "identifier", "uuid", "validate"],
  },
  execute: calculateValidateUuid,
  execution: { kind: "pure" },
  id: "validate/uuid",
  inputSchema: {
    additionalProperties: false,
    properties: { uuid: { type: "string" } },
    required: ["uuid"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      normalized: { type: "string" },
      valid: { type: "boolean" },
      version: { maximum: 15, minimum: 0, type: "integer" },
    },
    required: ["normalized", "valid", "version"],
    type: "object",
  },
  ports: {
    inputs: [{ id: "uuid", label: "UUID", required: true, valueType: { format: "uuid", type: "string" } }],
    outputs: [
      { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      { id: "version", label: "Version", valueType: { format: "uuid-version", type: "integer" } },
      { id: "normalized", label: "Normalized UUID", valueType: { format: "uuid", type: "string" } },
    ],
  },
  title: "UUID Validator",
});
export const runValidateUuid = validateUuidTool.execute;
export default validateUuidTool;
