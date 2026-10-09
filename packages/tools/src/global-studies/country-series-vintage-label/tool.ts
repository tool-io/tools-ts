import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly countryCode: string;
  readonly seriesCode: string;
  readonly vintage: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countryCode: { type: "string", maxLength: 8192, minLength: 1 },
    seriesCode: { type: "string", maxLength: 8192, minLength: 1 },
    vintage: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["countryCode", "seriesCode", "vintage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a caller-provided country-series identifier by its release vintage without selecting geopolitical codes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { countryCode, seriesCode, vintage } = request;
  const compute = (): Output => {
    H.domain(countryCode.length > 0, "countryCode");
    H.domain(seriesCode.length > 0, "seriesCode");
    H.domain(vintage.length > 0, "vintage");
    return { token: JSON.stringify([countryCode, seriesCode, vintage]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { countryCode: "AA", seriesCode: "SER17", vintage: "2026 release" },
  output: { token: '["AA","SER17","2026 release"]' },
} satisfies ToolExample<Input, Output>;
export const countrySeriesVintageLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["global-studies", "global studies", "social sciences"],
      keywords: ["global studies", "social sciences"],
    },
    id: "global-studies/country-series-vintage-label",
    title: "Country Series Vintage Label",
    description:
      "Qualify a caller-provided country-series identifier by its release vintage without selecting geopolitical codes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countryCode: { type: "string", maxLength: 8192, minLength: 1 },
        seriesCode: { type: "string", maxLength: 8192, minLength: 1 },
        vintage: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["countryCode", "seriesCode", "vintage"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "countryCode",
          label: "Country Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "seriesCode",
          label: "Series Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "vintage",
          label: "Vintage",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = countrySeriesVintageLabelTool.execute;
export default countrySeriesVintageLabelTool;
