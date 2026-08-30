import Sqids from "sqids";

import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DecodeSqidsInput = { readonly id: string };
export type DecodeSqidsOutput = { readonly numbers: readonly number[] };

const sqids = new Sqids();

export const calculateDecodeSqids = (input: unknown): ToolResult<DecodeSqidsOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return invalidInput([{ code: "object_required", field: "", message: "Input must be an object." }]);
  const record = input as Record<string, unknown>;
  if (Object.keys(record).some((field) => field !== "id"))
    return invalidInput([{ code: "unknown_field", field: "", message: "Only id is supported." }]);
  if (typeof record.id !== "string" || record.id.length < 1 || record.id.length > 1_000)
    return invalidInput([{ code: "id_invalid", field: "id", message: "Enter a Sqids identifier." }]);
  const numbers = sqids.decode(record.id);
  if (numbers.length === 0)
    return invalidInput([{ code: "id_invalid", field: "id", message: "The identifier is not valid for the default Sqids alphabet." }]);
  return toolSuccess({ numbers });
};

export const example = {
  input: { id: "86Rf07" },
  output: { numbers: [1, 2, 3] },
} satisfies ToolExample<DecodeSqidsInput, DecodeSqidsOutput>;

export const decodeSqidsTool = defineTool<DecodeSqidsInput, DecodeSqidsOutput>({
  contractVersion: 1,
  description: "Decode a Sqids identifier made with the standard alphabet into its original sequence of nonnegative integers.",
  discovery: {
    aliases: ["integer id decoder", "sqids decoder"],
    collections: ["encode-decode"],
    keywords: ["hashids", "identifier", "integer", "sqids"],
  },
  execute: calculateDecodeSqids,
  execution: { kind: "pure" },
  id: "decode/sqids",
  inputSchema: {
    additionalProperties: false,
    properties: { id: { maxLength: 1_000, minLength: 1, type: "string" } },
    required: ["id"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      numbers: { items: { minimum: 0, type: "integer" }, minItems: 1, type: "array" },
    },
    required: ["numbers"],
    type: "object",
  },
  ports: {
    inputs: [{ id: "id", label: "Sqid", required: true, valueType: { format: "sqid", type: "string" } }],
    outputs: [
      {
        id: "numbers",
        label: "Numbers",
        valueType: { items: { type: "integer" }, type: "list" },
      },
    ],
  },
  title: "Sqids Decoder",
});
export const runDecodeSqids = decodeSqidsTool.execute;
export default decodeSqidsTool;
