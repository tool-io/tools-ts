import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedCountry: string;
  readonly referenceCountry: string;
  readonly source: string;
  readonly sourceDate: string;
};
export type Output = { readonly matches: boolean; readonly provenance: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedCountry: { type: "string", maxLength: 8192 },
    referenceCountry: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    sourceDate: { type: "string", maxLength: 8192 },
  },
  required: ["suppliedCountry", "referenceCountry", "source", "sourceDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    provenance: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "provenance"],
} as const;
/** Compare a supplied LEI record country with supplied reference metadata; no country is decoded from the LEI itself. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedCountry, referenceCountry, source, sourceDate } = request;
  const compute = (): Output => {
    H.domain(
      suppliedCountry.length > 0 &&
        referenceCountry.length > 0 &&
        source.length > 0,
    );
    return {
      matches: suppliedCountry === referenceCountry,
      provenance: JSON.stringify([source, sourceDate, referenceCountry]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedCountry: "DE",
    referenceCountry: "DE",
    source: "registry",
    sourceDate: "2026-01-01",
  },
  output: { matches: true, provenance: '["registry","2026-01-01","DE"]' },
} satisfies ToolExample<Input, Output>;
export const leiCountryCodeSourceMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "validate/lei-country-code-source-match",
    title: "LEI Country Code Source Match Tool",
    description:
      "Compare a supplied LEI record country with supplied reference metadata; no country is decoded from the LEI itself.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedCountry: { type: "string", maxLength: 8192 },
        referenceCountry: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        sourceDate: { type: "string", maxLength: 8192 },
      },
      required: ["suppliedCountry", "referenceCountry", "source", "sourceDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        provenance: { type: "string", maxLength: 8192 },
      },
      required: ["matches", "provenance"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedCountry",
          label: "Supplied Country",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceCountry",
          label: "Reference Country",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceDate",
          label: "Source Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        {
          id: "provenance",
          label: "Provenance",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = leiCountryCodeSourceMatchTool.execute;
export default leiCountryCodeSourceMatchTool;
