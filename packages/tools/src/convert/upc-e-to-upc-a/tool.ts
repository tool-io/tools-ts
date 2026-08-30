import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess } from "../../core/result.js";
import { expandUpcE } from "../../standard-identifiers/upc-e.js";

export type UpcEToUpcAInput = { readonly upcE: string };
export type UpcEToUpcAOutput = { readonly upcA: string };

export const calculateUpcEToUpcA = (input: unknown) => {
  if (
    typeof input !== "object" ||
    input === null ||
    Array.isArray(input) ||
    typeof (input as Record<string, unknown>).upcE !== "string"
  )
    return invalidInput([
      { code: "upc_e_required", field: "upcE", message: "UPC-E is required." },
    ]);
  if (Object.keys(input).some((field) => field !== "upcE"))
    return invalidInput([
      { code: "unknown_field", field: "", message: "Only upcE is supported." },
    ]);
  const upcA = expandUpcE((input as UpcEToUpcAInput).upcE);
  return upcA
    ? toolSuccess({ upcA })
    : invalidInput([
        {
          code: "upc_e_invalid",
          field: "upcE",
          message: "Enter a valid eight-digit number-system 0 or 1 UPC-E.",
        },
      ]);
};

export const example = {
  input: { upcE: "04252614" },
  output: { upcA: "042100005264" },
} satisfies ToolExample<UpcEToUpcAInput, UpcEToUpcAOutput>;

export const upcEToUpcATool = defineTool<UpcEToUpcAInput, UpcEToUpcAOutput>({
  contractVersion: 1,
  description:
    "Expand a valid eight-digit UPC-E from number systems 0 or 1 into its equivalent twelve-digit UPC-A while preserving the verified check digit.",
  discovery: {
    aliases: ["expand upc-e", "upce to upca"],
    collections: ["identifiers"],
    keywords: ["barcode", "gtin-12", "upc"],
  },
  execute: calculateUpcEToUpcA,
  execution: { kind: "pure" },
  id: "convert/upc-e-to-upc-a",
  inputSchema: {
    additionalProperties: false,
    properties: { upcE: { maxLength: 32, type: "string" } },
    required: ["upcE"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: { upcA: { pattern: "^\\d{12}$", type: "string" } },
    required: ["upcA"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "upcE",
        label: "UPC-E",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [{ id: "upcA", label: "UPC-A", valueType: { type: "string" } }],
  },
  title: "UPC-E to UPC-A Converter",
});
export const runUpcEToUpcA = upcEToUpcATool.execute;
export default upcEToUpcATool;
