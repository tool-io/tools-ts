import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pages: number;
  readonly translatedFraction: number;
  readonly pricePerPage: number;
  readonly certificationFee: number;
  readonly rushFraction: number;
};
export type Output = {
  readonly translatedPages: number;
  readonly baseCost: number;
  readonly totalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pages: { type: "number", minimum: 0 },
    translatedFraction: { type: "number", minimum: 0, maximum: 1 },
    pricePerPage: { type: "number", minimum: 0 },
    certificationFee: { type: "number", minimum: 0 },
    rushFraction: { type: "number", minimum: 0 },
  },
  required: [
    "pages",
    "translatedFraction",
    "pricePerPage",
    "certificationFee",
    "rushFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    translatedPages: { type: "number" },
    baseCost: { type: "number" },
    totalCost: { type: "number" },
  },
  required: ["translatedPages", "baseCost", "totalCost"],
} as const;
/** Calculate international contract translation page cost from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    pages,
    translatedFraction,
    pricePerPage,
    certificationFee,
    rushFraction,
  } = request;
  const compute = (): Output => {
    H.domain(
      pages >= 0 &&
        pricePerPage >= 0 &&
        certificationFee >= 0 &&
        rushFraction >= 0,
    );
    H.probability(translatedFraction);
    return {
      translatedPages: pages * translatedFraction,
      baseCost: pages * translatedFraction * pricePerPage,
      totalCost:
        pages * translatedFraction * pricePerPage * (1 + rushFraction) +
        certificationFee,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pages: 40,
    translatedFraction: 0.75,
    pricePerPage: 20,
    certificationFee: 50,
    rushFraction: 0.2,
  },
  output: { translatedPages: 30, baseCost: 600, totalCost: 770 },
} satisfies ToolExample<Input, Output>;
export const internationalContractTranslationPageCostTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/international-contract-translation-page-cost",
      title: "International Contract Translation Page Cost Tool",
      description:
        "Calculate international contract translation page cost from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pages: { type: "number", minimum: 0 },
          translatedFraction: { type: "number", minimum: 0, maximum: 1 },
          pricePerPage: { type: "number", minimum: 0 },
          certificationFee: { type: "number", minimum: 0 },
          rushFraction: { type: "number", minimum: 0 },
        },
        required: [
          "pages",
          "translatedFraction",
          "pricePerPage",
          "certificationFee",
          "rushFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          translatedPages: { type: "number" },
          baseCost: { type: "number" },
          totalCost: { type: "number" },
        },
        required: ["translatedPages", "baseCost", "totalCost"],
      },
      ports: {
        inputs: [
          {
            id: "pages",
            label: "Pages",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "translatedFraction",
            label: "Translated Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pricePerPage",
            label: "Price Per Page",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "certificationFee",
            label: "Certification Fee",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rushFraction",
            label: "Rush Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "translatedPages",
            label: "Translated Pages",
            valueType: { type: "number" },
          },
          { id: "baseCost", label: "Base Cost", valueType: { type: "number" } },
          {
            id: "totalCost",
            label: "Total Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = internationalContractTranslationPageCostTool.execute;
export default internationalContractTranslationPageCostTool;
