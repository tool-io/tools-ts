import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly countryCodes: readonly string[];
  readonly countryWeights: readonly number[];
};
export type Output = {
  readonly countryCodes: readonly string[];
  readonly normalizedShares: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countryCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    countryWeights: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["countryCodes", "countryWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countryCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    normalizedShares: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["countryCodes", "normalizedShares"],
} as const;
/** Normalize explicitly assigned affiliation-country weights without inferring author nationality or geographic affiliations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { countryCodes, countryWeights } = request;
  const compute = (): Output => {
    H.domain(countryCodes.length === countryWeights.length, "countryWeights");
    H.domain(
      countryCodes.length > 0 &&
        new Set(countryCodes).size === countryCodes.length,
      "countryCodes",
    );
    countryWeights.forEach((v) => H.domain(v >= 0, "countryWeights"));
    const total = countryWeights.reduce((a, b) => a + b, 0);
    H.domain(total > 0 && Number.isFinite(total), "countryWeights");
    return {
      countryCodes: [...countryCodes],
      normalizedShares: countryWeights.map((v) => v / total),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { countryCodes: ["GH", "GB"], countryWeights: [1, 3] },
  output: { countryCodes: ["GH", "GB"], normalizedShares: [0.25, 0.75] },
} satisfies ToolExample<Input, Output>;
export const affiliationCountryFractionInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/affiliation-country-fraction-input",
    title: "Affiliation Country Fraction Input",
    description:
      "Normalize explicitly assigned affiliation-country weights without inferring author nationality or geographic affiliations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countryCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        countryWeights: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["countryCodes", "countryWeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countryCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        normalizedShares: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["countryCodes", "normalizedShares"],
    },
    ports: {
      inputs: [
        {
          id: "countryCodes",
          label: "Country Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "countryWeights",
          label: "Country Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "countryCodes",
          label: "Country Codes",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "normalizedShares",
          label: "Normalized Shares",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = affiliationCountryFractionInputTool.execute;
export default affiliationCountryFractionInputTool;
