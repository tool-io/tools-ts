import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceYear: number;
  readonly targetYear: number;
  readonly suppliedSourceOrigin: number;
  readonly suppliedTargetOrigin: number;
};
export type Output = {
  readonly normalizedSourceDecimal: string;
  readonly normalizedTargetDecimal: string;
  readonly gapDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceYear: { type: "integer" },
    targetYear: { type: "integer" },
    suppliedSourceOrigin: { type: "integer" },
    suppliedTargetOrigin: { type: "integer" },
  },
  required: [
    "sourceYear",
    "targetYear",
    "suppliedSourceOrigin",
    "suppliedTargetOrigin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedSourceDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    normalizedTargetDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    gapDecimal: { type: "string", maxLength: 8192, format: "integer-decimal" },
  },
  required: [
    "normalizedSourceDecimal",
    "normalizedTargetDecimal",
    "gapDecimal",
  ],
} as const;
/** Compare explicit public year-origin mappings without choosing or inventing an era conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceYear, targetYear, suppliedSourceOrigin, suppliedTargetOrigin } =
    request;
  const compute = (): Output => {
    return (() => {
      const a = BigInt(sourceYear) + BigInt(suppliedSourceOrigin),
        b = BigInt(targetYear) + BigInt(suppliedTargetOrigin);
      return {
        normalizedSourceDecimal: a.toString(),
        normalizedTargetDecimal: b.toString(),
        gapDecimal: (b - a).toString(),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceYear: 10,
    targetYear: 12,
    suppliedSourceOrigin: 1900,
    suppliedTargetOrigin: 1900,
  },
  output: {
    normalizedSourceDecimal: "1910",
    normalizedTargetDecimal: "1912",
    gapDecimal: "2",
  },
} satisfies ToolExample<Input, Output>;
export const publicAfricanEraYearGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/public-african-era-year-gap",
    title: "Public African Era Year Gap Tool",
    description:
      "Compare explicit public year-origin mappings without choosing or inventing an era conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceYear: { type: "integer" },
        targetYear: { type: "integer" },
        suppliedSourceOrigin: { type: "integer" },
        suppliedTargetOrigin: { type: "integer" },
      },
      required: [
        "sourceYear",
        "targetYear",
        "suppliedSourceOrigin",
        "suppliedTargetOrigin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedSourceDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        normalizedTargetDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        gapDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: [
        "normalizedSourceDecimal",
        "normalizedTargetDecimal",
        "gapDecimal",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sourceYear",
          label: "Source Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetYear",
          label: "Target Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedSourceOrigin",
          label: "Supplied Source Origin",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedTargetOrigin",
          label: "Supplied Target Origin",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "normalizedSourceDecimal",
          label: "Normalized Source Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "normalizedTargetDecimal",
          label: "Normalized Target Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "gapDecimal",
          label: "Gap Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicAfricanEraYearGapTool.execute;
export default publicAfricanEraYearGapTool;
