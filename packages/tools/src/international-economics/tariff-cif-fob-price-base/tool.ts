import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fobValue: number;
  readonly freight: number;
  readonly insurance: number;
  readonly tariffFraction: number;
  readonly useCifBase: boolean;
};
export type Output = {
  readonly taxBase: number;
  readonly tariffAmount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fobValue: { type: "number", minimum: 0 },
    freight: { type: "number", minimum: 0 },
    insurance: { type: "number", minimum: 0 },
    tariffFraction: { type: "number", minimum: 0 },
    useCifBase: { type: "boolean" },
  },
  required: [
    "fobValue",
    "freight",
    "insurance",
    "tariffFraction",
    "useCifBase",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { taxBase: { type: "number" }, tariffAmount: { type: "number" } },
  required: ["taxBase", "tariffAmount"],
} as const;
/** Apply an explicitly supplied tariff fraction to a caller-selected FOB or additive CIF base without determining customs valuation rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fobValue, freight, insurance, tariffFraction, useCifBase } = request;
  const compute = (): Output => {
    H.domain(
      fobValue >= 0 && freight >= 0 && insurance >= 0 && tariffFraction >= 0,
      "fobValue",
    );
    return (() => {
      const taxBase = fobValue + (useCifBase ? freight + insurance : 0);
      return { taxBase, tariffAmount: taxBase * tariffFraction };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fobValue: 1000,
    freight: 100,
    insurance: 20,
    tariffFraction: 0.1,
    useCifBase: true,
  },
  output: { taxBase: 1120, tariffAmount: 112 },
} satisfies ToolExample<Input, Output>;
export const tariffCifFobPriceBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "data"],
      fields: [
        "international-economics",
        "international economics",
        "economics",
      ],
      keywords: ["international economics", "economics"],
    },
    id: "international-economics/tariff-cif-fob-price-base",
    title: "Tariff Cif Fob Price Base",
    description:
      "Apply an explicitly supplied tariff fraction to a caller-selected FOB or additive CIF base without determining customs valuation rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fobValue: { type: "number", minimum: 0 },
        freight: { type: "number", minimum: 0 },
        insurance: { type: "number", minimum: 0 },
        tariffFraction: { type: "number", minimum: 0 },
        useCifBase: { type: "boolean" },
      },
      required: [
        "fobValue",
        "freight",
        "insurance",
        "tariffFraction",
        "useCifBase",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxBase: { type: "number" },
        tariffAmount: { type: "number" },
      },
      required: ["taxBase", "tariffAmount"],
    },
    ports: {
      inputs: [
        {
          id: "fobValue",
          label: "Fob Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freight",
          label: "Freight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insurance",
          label: "Insurance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tariffFraction",
          label: "Tariff Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useCifBase",
          label: "Use Cif Base",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "taxBase", label: "Tax Base", valueType: { type: "number" } },
        {
          id: "tariffAmount",
          label: "Tariff Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tariffCifFobPriceBaseTool.execute;
export default tariffCifFobPriceBaseTool;
