import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly soluteAmount: number;
  readonly aqueousVolume: number;
  readonly organicVolume: number;
  readonly distributionRatio: number;
};
export type Output = {
  readonly aqueousConcentration: number;
  readonly organicConcentration: number;
  readonly extractedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    soluteAmount: { type: "number", minimum: 0 },
    aqueousVolume: { type: "number", exclusiveMinimum: 0 },
    organicVolume: { type: "number", minimum: 0 },
    distributionRatio: { type: "number", minimum: 0 },
  },
  required: [
    "soluteAmount",
    "aqueousVolume",
    "organicVolume",
    "distributionRatio",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aqueousConcentration: { type: "number" },
    organicConcentration: { type: "number" },
    extractedFraction: { type: "number" },
  },
  required: [
    "aqueousConcentration",
    "organicConcentration",
    "extractedFraction",
  ],
} as const;
/** Ideal single equilibrium stage with K=Corganic/Caqueous and unchanged phase volumes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { soluteAmount, aqueousVolume, organicVolume, distributionRatio } =
    request;
  const compute = (): Output => {
    H.domain(soluteAmount >= 0 && organicVolume >= 0 && distributionRatio >= 0);
    H.positive(aqueousVolume);
    return {
      aqueousConcentration:
        soluteAmount / (aqueousVolume + distributionRatio * organicVolume),
      organicConcentration:
        (soluteAmount * distributionRatio) /
        (aqueousVolume + distributionRatio * organicVolume),
      extractedFraction:
        (distributionRatio * organicVolume) /
        (aqueousVolume + distributionRatio * organicVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    soluteAmount: 100,
    aqueousVolume: 10,
    organicVolume: 5,
    distributionRatio: 2,
  },
  output: {
    aqueousConcentration: 5,
    organicConcentration: 10,
    extractedFraction: 0.5,
  },
} satisfies ToolExample<Input, Output>;
export const liquidLiquidPartitionOneStageTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/liquid-liquid-partition-one-stage-term",
    title: "Liquid Liquid Partition One Stage Term Tool",
    description:
      "Ideal single equilibrium stage with K=Corganic/Caqueous and unchanged phase volumes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        soluteAmount: { type: "number", minimum: 0 },
        aqueousVolume: { type: "number", exclusiveMinimum: 0 },
        organicVolume: { type: "number", minimum: 0 },
        distributionRatio: { type: "number", minimum: 0 },
      },
      required: [
        "soluteAmount",
        "aqueousVolume",
        "organicVolume",
        "distributionRatio",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        aqueousConcentration: { type: "number" },
        organicConcentration: { type: "number" },
        extractedFraction: { type: "number" },
      },
      required: [
        "aqueousConcentration",
        "organicConcentration",
        "extractedFraction",
      ],
    },
    ports: {
      inputs: [
        {
          id: "soluteAmount",
          label: "Solute Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aqueousVolume",
          label: "Aqueous Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "organicVolume",
          label: "Organic Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "distributionRatio",
          label: "Distribution Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "aqueousConcentration",
          label: "Aqueous Concentration",
          valueType: { type: "number" },
        },
        {
          id: "organicConcentration",
          label: "Organic Concentration",
          valueType: { type: "number" },
        },
        {
          id: "extractedFraction",
          label: "Extracted Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = liquidLiquidPartitionOneStageTermTool.execute;
export default liquidLiquidPartitionOneStageTermTool;
