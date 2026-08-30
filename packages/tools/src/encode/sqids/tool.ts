import Sqids from "sqids";

import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type EncodeSqidsInput = { readonly numbers: readonly number[] };
export type EncodeSqidsOutput = { readonly id: string };

const sqids = new Sqids();

export const calculateEncodeSqids = (input: unknown): ToolResult<EncodeSqidsOutput> => {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return invalidInput([{ code: "object_required", field: "", message: "Input must be an object." }]);
  const record = input as Record<string, unknown>;
  if (Object.keys(record).some((field) => field !== "numbers"))
    return invalidInput([{ code: "unknown_field", field: "", message: "Only numbers is supported." }]);
  if (
    !Array.isArray(record.numbers) ||
    record.numbers.length < 1 ||
    record.numbers.length > 100 ||
    !record.numbers.every((value) => Number.isSafeInteger(value) && value >= 0)
  )
    return invalidInput([
      {
        code: "numbers_invalid",
        field: "numbers",
        message: "Provide 1 to 100 nonnegative safe integers.",
      },
    ]);
  return toolSuccess({ id: sqids.encode(record.numbers as number[]) });
};

export const example = {
  input: { numbers: [1, 2, 3] },
  output: { id: "86Rf07" },
} satisfies ToolExample<EncodeSqidsInput, EncodeSqidsOutput>;

export const encodeSqidsTool = defineTool<EncodeSqidsInput, EncodeSqidsOutput>({
  contractVersion: 1,
  description: "Encode one or more nonnegative integers as a short Sqids identifier using the standard alphabet and blocklist.",
  discovery: {
    aliases: ["integer id encoder", "sqids encoder", "sqids generator"],
    collections: ["encode-decode"],
    keywords: ["hashids", "identifier", "integer", "sqids"],
  },
  execute: calculateEncodeSqids,
  execution: { kind: "pure" },
  id: "encode/sqids",
  inputSchema: {
    additionalProperties: false,
    properties: {
      numbers: {
        items: { minimum: 0, type: "integer" },
        maxItems: 100,
        minItems: 1,
        type: "array",
      },
    },
    required: ["numbers"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: { id: { minLength: 1, type: "string" } },
    required: ["id"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "numbers",
        label: "Numbers",
        required: true,
        valueType: { items: { type: "integer" }, type: "list" },
      },
    ],
    outputs: [{ id: "id", label: "Sqid", valueType: { format: "sqid", type: "string" } }],
  },
  title: "Sqids Encoder",
});
export const runEncodeSqids = encodeSqidsTool.execute;
export default encodeSqidsTool;
