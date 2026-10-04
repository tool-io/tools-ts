import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly identifier: string };
export type Output = { readonly canonical: string; readonly valid: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canonical: { type: "string", maxLength: 8192 },
    valid: { type: "boolean" },
  },
  required: ["canonical", "valid"],
} as const;
/** Calculate orcid checksum canonical grouping from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier } = request;
  const compute = (): Output => {
    const raw = identifier.replaceAll("-", "");
    if (
      !/^\d{15}[\dX](?![\s\S])/.test(raw) ||
      !(
        identifier === raw ||
        /^\d{4}-\d{4}-\d{4}-\d{3}[\dX](?![\s\S])/.test(identifier)
      )
    )
      return { canonical: "", valid: false };
    let total = 0;
    for (const digit of raw.slice(0, 15)) total = (total + Number(digit)) * 2;
    const result = (12 - (total % 11)) % 11,
      check = result === 10 ? "X" : String(result);
    return {
      canonical: raw.match(/.{4}/g)?.join("-") ?? "",
      valid: raw[15] === check,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifier: "0000000218250097" },
  output: { canonical: "0000-0002-1825-0097", valid: true },
} satisfies ToolExample<Input, Output>;
export const orcidChecksumCanonicalGroupingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/orcid-checksum-canonical-grouping",
    title: "ORCID Checksum Canonical Grouping Tool",
    description:
      "Calculate orcid checksum canonical grouping from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { identifier: { type: "string", maxLength: 8192 } },
      required: ["identifier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canonical: { type: "string", maxLength: 8192 },
        valid: { type: "boolean" },
      },
      required: ["canonical", "valid"],
    },
    ports: {
      inputs: [
        {
          id: "identifier",
          label: "Identifier",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "canonical", label: "Canonical", valueType: { type: "string" } },
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = orcidChecksumCanonicalGroupingTool.execute;
export default orcidChecksumCanonicalGroupingTool;
