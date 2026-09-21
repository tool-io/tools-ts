import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly residueMass: number;
  readonly salePrice: number;
  readonly collectionCostPerMass: number;
  readonly retainedValuePerMass: number;
};
export type Output = {
  readonly saleNet: number;
  readonly retentionValue: number;
  readonly retentionAdvantage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residueMass: { type: "number", minimum: 0 },
    salePrice: { type: "number", minimum: 0 },
    collectionCostPerMass: { type: "number", minimum: 0 },
    retainedValuePerMass: { type: "number", minimum: 0 },
  },
  required: [
    "residueMass",
    "salePrice",
    "collectionCostPerMass",
    "retainedValuePerMass",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    saleNet: { type: "number" },
    retentionValue: { type: "number" },
    retentionAdvantage: { type: "number" },
  },
  required: ["saleNet", "retentionValue", "retentionAdvantage"],
} as const;
/** Calculate crop residue opportunity cost term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    residueMass,
    salePrice,
    collectionCostPerMass,
    retainedValuePerMass,
  } = request;
  const compute = (): Output => {
    H.domain(
      residueMass >= 0 &&
        salePrice >= 0 &&
        collectionCostPerMass >= 0 &&
        retainedValuePerMass >= 0,
    );
    return {
      saleNet: residueMass * (salePrice - collectionCostPerMass),
      retentionValue: residueMass * retainedValuePerMass,
      retentionAdvantage:
        residueMass *
        (retainedValuePerMass - salePrice + collectionCostPerMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    residueMass: 100,
    salePrice: 20,
    collectionCostPerMass: 5,
    retainedValuePerMass: 18,
  },
  output: { saleNet: 1500, retentionValue: 1800, retentionAdvantage: 300 },
} satisfies ToolExample<Input, Output>;
export const cropResidueOpportunityCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/crop-residue-opportunity-cost-term",
    title: "Crop Residue Opportunity Cost Term Tool",
    description:
      "Calculate crop residue opportunity cost term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residueMass: { type: "number", minimum: 0 },
        salePrice: { type: "number", minimum: 0 },
        collectionCostPerMass: { type: "number", minimum: 0 },
        retainedValuePerMass: { type: "number", minimum: 0 },
      },
      required: [
        "residueMass",
        "salePrice",
        "collectionCostPerMass",
        "retainedValuePerMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        saleNet: { type: "number" },
        retentionValue: { type: "number" },
        retentionAdvantage: { type: "number" },
      },
      required: ["saleNet", "retentionValue", "retentionAdvantage"],
    },
    ports: {
      inputs: [
        {
          id: "residueMass",
          label: "Residue Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "salePrice",
          label: "Sale Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "collectionCostPerMass",
          label: "Collection Cost Per Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retainedValuePerMass",
          label: "Retained Value Per Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "saleNet", label: "Sale Net", valueType: { type: "number" } },
        {
          id: "retentionValue",
          label: "Retention Value",
          valueType: { type: "number" },
        },
        {
          id: "retentionAdvantage",
          label: "Retention Advantage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropResidueOpportunityCostTermTool.execute;
export default cropResidueOpportunityCostTermTool;
