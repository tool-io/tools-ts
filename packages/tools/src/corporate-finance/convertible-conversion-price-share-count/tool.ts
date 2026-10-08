import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly convertiblePrincipal: number;
  readonly conversionPricePerShare: number;
};
export type Output = {
  readonly rawShares: number;
  readonly wholeShares: number;
  readonly fractionalShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertiblePrincipal: { type: "number", minimum: 0 },
    conversionPricePerShare: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["convertiblePrincipal", "conversionPricePerShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawShares: { type: "number" },
    wholeShares: { type: "integer" },
    fractionalShare: { type: "number" },
  },
  required: ["rawShares", "wholeShares", "fractionalShare"],
} as const;
/** Divide an explicit convertible principal by a positive conversion price, separating whole and fractional shares without deciding fractional-share settlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { convertiblePrincipal, conversionPricePerShare } = request;
  const compute = (): Output => {
    H.domain(convertiblePrincipal >= 0, "convertiblePrincipal");
    (H.domain(conversionPricePerShare > 0, "conversionPricePerShare"),
      conversionPricePerShare);
    return (() => {
      const rawShares = convertiblePrincipal / conversionPricePerShare,
        wholeShares = Math.floor(rawShares);
      return {
        rawShares,
        wholeShares,
        fractionalShare: rawShares - wholeShares,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { convertiblePrincipal: 1000, conversionPricePerShare: 8 },
  output: { rawShares: 125, wholeShares: 125, fractionalShare: 0 },
} satisfies ToolExample<Input, Output>;
export const convertibleConversionPriceShareCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "trading"],
        fields: [
          "corporate-finance",
          "corporate finance",
          "business and finance",
        ],
        keywords: ["corporate finance", "business and finance"],
      },
      id: "corporate-finance/convertible-conversion-price-share-count",
      title: "Convertible Conversion Price Share Count",
      description:
        "Divide an explicit convertible principal by a positive conversion price, separating whole and fractional shares without deciding fractional-share settlement.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          convertiblePrincipal: { type: "number", minimum: 0 },
          conversionPricePerShare: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["convertiblePrincipal", "conversionPricePerShare"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawShares: { type: "number" },
          wholeShares: { type: "integer" },
          fractionalShare: { type: "number" },
        },
        required: ["rawShares", "wholeShares", "fractionalShare"],
      },
      ports: {
        inputs: [
          {
            id: "convertiblePrincipal",
            label: "Convertible Principal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "conversionPricePerShare",
            label: "Conversion Price Per Share",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "rawShares",
            label: "Raw Shares",
            valueType: { type: "number" },
          },
          {
            id: "wholeShares",
            label: "Whole Shares",
            valueType: { type: "integer" },
          },
          {
            id: "fractionalShare",
            label: "Fractional Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = convertibleConversionPriceShareCountTool.execute;
export default convertibleConversionPriceShareCountTool;
