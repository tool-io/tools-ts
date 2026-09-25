import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly consumerProduction: number;
  readonly resourceProduction: number;
  readonly ingestedEnergy: number;
  readonly assimilatedEnergy: number;
};
export type Output = {
  readonly trophicEfficiency: number;
  readonly assimilationEfficiency: number;
  readonly productionEfficiency: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumerProduction: { type: "number", minimum: 0 },
    resourceProduction: { type: "number", exclusiveMinimum: 0 },
    ingestedEnergy: { type: "number", exclusiveMinimum: 0 },
    assimilatedEnergy: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "consumerProduction",
    "resourceProduction",
    "ingestedEnergy",
    "assimilatedEnergy",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trophicEfficiency: { type: "number" },
    assimilationEfficiency: { type: "number" },
    productionEfficiency: { type: "number" },
  },
  required: [
    "trophicEfficiency",
    "assimilationEfficiency",
    "productionEfficiency",
  ],
} as const;
/** Separate matched-period trophic, assimilation and production efficiency ratios; boundaries must be defined consistently by the caller. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    consumerProduction,
    resourceProduction,
    ingestedEnergy,
    assimilatedEnergy,
  } = request;
  const compute = (): Output => {
    H.positive(resourceProduction);
    H.positive(ingestedEnergy);
    H.positive(assimilatedEnergy);
    H.domain(consumerProduction >= 0 && assimilatedEnergy <= ingestedEnergy);
    return {
      trophicEfficiency: consumerProduction / resourceProduction,
      assimilationEfficiency: assimilatedEnergy / ingestedEnergy,
      productionEfficiency: consumerProduction / assimilatedEnergy,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    consumerProduction: 10,
    resourceProduction: 100,
    ingestedEnergy: 50,
    assimilatedEnergy: 25,
  },
  output: {
    trophicEfficiency: 0.1,
    assimilationEfficiency: 0.5,
    productionEfficiency: 0.4,
  },
} satisfies ToolExample<Input, Output>;
export const ecologicalEfficiencyTrophicTransferTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/ecological-efficiency-trophic-transfer-term",
      title: "Ecological Efficiency Trophic Transfer Term Tool",
      description:
        "Separate matched-period trophic, assimilation and production efficiency ratios; boundaries must be defined consistently by the caller.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          consumerProduction: { type: "number", minimum: 0 },
          resourceProduction: { type: "number", exclusiveMinimum: 0 },
          ingestedEnergy: { type: "number", exclusiveMinimum: 0 },
          assimilatedEnergy: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "consumerProduction",
          "resourceProduction",
          "ingestedEnergy",
          "assimilatedEnergy",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          trophicEfficiency: { type: "number" },
          assimilationEfficiency: { type: "number" },
          productionEfficiency: { type: "number" },
        },
        required: [
          "trophicEfficiency",
          "assimilationEfficiency",
          "productionEfficiency",
        ],
      },
      ports: {
        inputs: [
          {
            id: "consumerProduction",
            label: "Consumer Production",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "resourceProduction",
            label: "Resource Production",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "ingestedEnergy",
            label: "Ingested Energy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "assimilatedEnergy",
            label: "Assimilated Energy",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "trophicEfficiency",
            label: "Trophic Efficiency",
            valueType: { type: "number" },
          },
          {
            id: "assimilationEfficiency",
            label: "Assimilation Efficiency",
            valueType: { type: "number" },
          },
          {
            id: "productionEfficiency",
            label: "Production Efficiency",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = ecologicalEfficiencyTrophicTransferTermTool.execute;
export default ecologicalEfficiencyTrophicTransferTermTool;
