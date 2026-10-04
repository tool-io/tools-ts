import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly uuid: string; readonly expected: number };
export type Output = {
  readonly valid: boolean;
  readonly version: number;
  readonly matches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uuid: { type: "string", maxLength: 8192 },
    expected: { type: "integer", minimum: 0, maximum: 15 },
  },
  required: ["uuid", "expected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    valid: { type: "boolean" },
    version: { type: "integer" },
    matches: { type: "boolean" },
  },
  required: ["valid", "version", "matches"],
} as const;
/** Calculate uuid version nibble consistency from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { uuid, expected } = request;
  const compute = (): Output => {
    H.integer(expected, 0, 15);
    const valid =
        /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}(?![\s\S])/.test(
          uuid,
        ),
      version = valid ? parseInt(uuid[14], 16) : 0;
    return { valid, version, matches: valid && version === expected };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { uuid: "550e8400-e29b-41d4-a716-446655440000", expected: 4 },
  output: { valid: true, version: 4, matches: true },
} satisfies ToolExample<Input, Output>;
export const uuidVersionNibbleConsistencyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/uuid-version-nibble-consistency",
    title: "Uuid Version Nibble Consistency Tool",
    description:
      "Calculate uuid version nibble consistency from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uuid: { type: "string", maxLength: 8192 },
        expected: { type: "integer", minimum: 0, maximum: 15 },
      },
      required: ["uuid", "expected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        version: { type: "integer" },
        matches: { type: "boolean" },
      },
      required: ["valid", "version", "matches"],
    },
    ports: {
      inputs: [
        {
          id: "uuid",
          label: "Uuid",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expected",
          label: "Expected",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        { id: "version", label: "Version", valueType: { type: "integer" } },
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = uuidVersionNibbleConsistencyTool.execute;
export default uuidVersionNibbleConsistencyTool;
