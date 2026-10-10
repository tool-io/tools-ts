import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packPrice: number;
  readonly unitsInPack: number;
  readonly suppliedComparisonUnitPrice: number;
};
export type Output = {
  readonly packUnitPrice: number;
  readonly unitPriceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packPrice: { type: "number", minimum: 0 },
    unitsInPack: { type: "integer", minimum: 1 },
    suppliedComparisonUnitPrice: { type: "number", minimum: 0 },
  },
  required: ["packPrice", "unitsInPack", "suppliedComparisonUnitPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packUnitPrice: { type: "number" },
    unitPriceGap: { type: "number" },
  },
  required: ["packUnitPrice", "unitPriceGap"],
} as const;
/** Compare an explicit minibar pack unit price with a supplied compatible unit price without fetching prices. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { packPrice, unitsInPack, suppliedComparisonUnitPrice } = request;
  const compute = (): Output => {
    H.domain(packPrice >= 0 && suppliedComparisonUnitPrice >= 0, "packPrice");
    (H.domain(
      Number.isSafeInteger(unitsInPack) &&
        unitsInPack >= 1 &&
        unitsInPack <= Number.MAX_SAFE_INTEGER,
      "unitsInPack",
    ),
      unitsInPack);
    return {
      packUnitPrice: packPrice / unitsInPack,
      unitPriceGap: packPrice / unitsInPack - suppliedComparisonUnitPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { packPrice: 12, unitsInPack: 4, suppliedComparisonUnitPrice: 2.5 },
  output: { packUnitPrice: 3, unitPriceGap: 0.5 },
} satisfies ToolExample<Input, Output>;
export const minibarPackageUnitPriceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospitality", "business and finance"],
      keywords: ["hospitality", "business and finance"],
    },
    id: "hospitality/minibar-package-unit-price-gap",
    title: "Minibar Package Unit Price Gap",
    description:
      "Compare an explicit minibar pack unit price with a supplied compatible unit price without fetching prices.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packPrice: { type: "number", minimum: 0 },
        unitsInPack: { type: "integer", minimum: 1 },
        suppliedComparisonUnitPrice: { type: "number", minimum: 0 },
      },
      required: ["packPrice", "unitsInPack", "suppliedComparisonUnitPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packUnitPrice: { type: "number" },
        unitPriceGap: { type: "number" },
      },
      required: ["packUnitPrice", "unitPriceGap"],
    },
    ports: {
      inputs: [
        {
          id: "packPrice",
          label: "Pack Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitsInPack",
          label: "Units In Pack",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedComparisonUnitPrice",
          label: "Supplied Comparison Unit Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "packUnitPrice",
          label: "Pack Unit Price",
          valueType: { type: "number" },
        },
        {
          id: "unitPriceGap",
          label: "Unit Price Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = minibarPackageUnitPriceGapTool.execute;
export default minibarPackageUnitPriceGapTool;
