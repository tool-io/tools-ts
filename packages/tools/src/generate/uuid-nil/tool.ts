import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess } from "../../core/result.js";

const identifier = "00000000-0000-0000-0000-000000000000";
export const calculateUuidNil = (input: unknown) =>
  typeof input === "object" &&
  input !== null &&
  !Array.isArray(input) &&
  Object.keys(input).length === 0
    ? toolSuccess({ identifier })
    : invalidInput([
        {
          code: "empty_object_required",
          field: "",
          message: "Input must be an empty object.",
        },
      ]);
export const example = {
  input: {},
  output: { identifier },
} satisfies ToolExample<Record<string, never>, { readonly identifier: string }>;
export const uuidNilTool = defineTool({
  contractVersion: 1,
  description:
    "Return the RFC 9562 Nil UUID, whose 128 bits are all zero and which represents an absent UUID value.",
  discovery: {
    aliases: ["nil uuid", "zero uuid"],
    keywords: ["identifier", "nil", "uuid"],
  },
  execute: calculateUuidNil,
  execution: { kind: "pure" },
  id: "generate/uuid-nil",
  inputSchema: { additionalProperties: false, properties: {}, type: "object" },
  outputSchema: {
    additionalProperties: false,
    properties: { identifier: { const: identifier, type: "string" } },
    required: ["identifier"],
    type: "object",
  },
  ports: {
    inputs: [],
    outputs: [
      {
        id: "identifier",
        label: "Nil UUID",
        valueType: { format: "uuid", type: "string" },
      },
    ],
  },
  title: "Nil UUID",
});
export const runUuidNil = uuidNilTool.execute;
export default uuidNilTool;
