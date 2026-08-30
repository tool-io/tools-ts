import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess } from "../../core/result.js";
import { compressUpcA } from "../../standard-identifiers/upc-e.js";

export type UpcAToUpcEInput = { readonly upcA: string };
export type UpcAToUpcEOutput = { readonly upcE: string };

export const calculateUpcAToUpcE = (input: unknown) => {
  if (
    typeof input !== "object" ||
    input === null ||
    Array.isArray(input) ||
    typeof (input as Record<string, unknown>).upcA !== "string"
  )
    return invalidInput([
      { code: "upc_a_required", field: "upcA", message: "UPC-A is required." },
    ]);
  if (Object.keys(input).some((field) => field !== "upcA"))
    return invalidInput([
      { code: "unknown_field", field: "", message: "Only upcA is supported." },
    ]);
  const upcE = compressUpcA((input as UpcAToUpcEInput).upcA);
  return upcE
    ? toolSuccess({ upcE })
    : invalidInput([
        {
          code: "upc_a_not_compressible",
          field: "upcA",
          message:
            "Enter a valid number-system 0 or 1 UPC-A whose manufacturer and product fields satisfy a UPC-E zero-suppression rule.",
        },
      ]);
};

export const example = {
  input: { upcA: "042100005264" },
  output: { upcE: "04252614" },
} satisfies ToolExample<UpcAToUpcEInput, UpcAToUpcEOutput>;

export const upcAToUpcETool = defineTool<UpcAToUpcEInput, UpcAToUpcEOutput>({
  contractVersion: 1,
  description:
    "Compress a valid number-system 0 or 1 UPC-A into UPC-E only when its manufacturer and product fields match a defined zero-suppression pattern.",
  discovery: {
    aliases: ["compress upc-a", "upca to upce"],
    collections: ["identifiers"],
    keywords: ["barcode", "gtin-12", "upc"],
  },
  execute: calculateUpcAToUpcE,
  execution: { kind: "pure" },
  id: "convert/upc-a-to-upc-e",
  inputSchema: {
    additionalProperties: false,
    properties: { upcA: { maxLength: 32, type: "string" } },
    required: ["upcA"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: { upcE: { pattern: "^\\d{8}$", type: "string" } },
    required: ["upcE"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "upcA",
        label: "UPC-A",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "upcE", label: "UPC-E", valueType: { type: "string" } }],
  },
  title: "UPC-A to UPC-E Converter",
});
export const runUpcAToUpcE = upcAToUpcETool.execute;
export default upcAToUpcETool;
