import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quality: string;
  readonly unit: string;
  readonly source: string;
  readonly expectedQuality: string;
  readonly expectedUnit: string;
};
export type Output = { readonly comparable: boolean; readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quality: { type: "string", maxLength: 8192 },
    unit: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    expectedQuality: { type: "string", maxLength: 8192 },
    expectedUnit: { type: "string", maxLength: 8192 },
  },
  required: ["quality", "unit", "source", "expectedQuality", "expectedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    comparable: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["comparable", "key"],
} as const;
/** Preserve supplied price quality/unit provenance before comparison; no historical price series is normalized. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quality, unit, source, expectedQuality, expectedUnit } = request;
  const compute = (): Output => {
    return {
      comparable: quality === expectedQuality && unit === expectedUnit,
      key: JSON.stringify([source, quality, unit]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quality: "grade-A",
    unit: "kg",
    source: "ledger",
    expectedQuality: "grade-A",
    expectedUnit: "kg",
  },
  output: { comparable: true, key: '["ledger","grade-A","kg"]' },
} satisfies ToolExample<Input, Output>;
export const archivalPriceQualityUnitTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/archival-price-quality-unit-token",
    title: "Archival Price Quality Unit Token Tool",
    description:
      "Preserve supplied price quality/unit provenance before comparison; no historical price series is normalized.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quality: { type: "string", maxLength: 8192 },
        unit: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        expectedQuality: { type: "string", maxLength: 8192 },
        expectedUnit: { type: "string", maxLength: 8192 },
      },
      required: [
        "quality",
        "unit",
        "source",
        "expectedQuality",
        "expectedUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        comparable: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["comparable", "key"],
    },
    ports: {
      inputs: [
        {
          id: "quality",
          label: "Quality",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unit",
          label: "Unit",
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
          id: "expectedQuality",
          label: "Expected Quality",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedUnit",
          label: "Expected Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "comparable",
          label: "Comparable",
          valueType: { type: "boolean" },
        },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = archivalPriceQualityUnitTokenTool.execute;
export default archivalPriceQualityUnitTokenTool;
