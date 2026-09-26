import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly include: boolean };
export type Output = { readonly octets: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { include: { type: "boolean" } },
  required: ["include"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    octets: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["octets"],
} as const;
/** Compute utf-8 bom octet triplet from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { include } = input;
  const compute = (): Output => {
    return { octets: include ? [239, 187, 191] : [] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { include: true },
  output: { octets: [239, 187, 191] },
} satisfies ToolExample<Input, Output>;
export const utf8BomOctetTripletTool = defineSchemaCalculation<Input, Output>({
  id: "encode/utf8-bom-octet-triplet",
  title: "UTF-8 BOM Octet Triplet Tool",
  description: "Compute utf-8 bom octet triplet from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "include",
        label: "Include",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [
      {
        id: "octets",
        label: "Octets",
        valueType: { type: "list", items: { type: "integer" } },
      },
    ],
  },
});
export const run = utf8BomOctetTripletTool.execute;
export default utf8BomOctetTripletTool;
