import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess } from "../../core/result.js";

const identifier = "ffffffff-ffff-ffff-ffff-ffffffffffff";
export const calculateUuidMax = (input: unknown) =>
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
export const uuidMaxTool = defineTool({
  contractVersion: 1,
  description:
    "Return the RFC 9562 Max UUID, whose 128 bits are all one and which can serve as an upper sentinel value.",
  discovery: {
    aliases: ["max uuid", "maximum uuid"],
    keywords: ["identifier", "max", "uuid"],
  },
  execute: calculateUuidMax,
  execution: { kind: "pure" },
  id: "generate/uuid-max",
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
        label: "Max UUID",
        valueType: { format: "uuid", type: "string" },
      },
    ],
  },
  title: "Max UUID",
});
export const runUuidMax = uuidMaxTool.execute;
export default uuidMaxTool;
