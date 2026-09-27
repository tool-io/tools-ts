import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleConcentration: number;
  readonly referenceConcentration: number;
  readonly previousNormalized: number;
  readonly nextNormalized: number;
};
export type Output = {
  readonly normalized: number;
  readonly geometricNeighborBaseline: number;
  readonly anomaly: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleConcentration: { type: "number", minimum: 0 },
    referenceConcentration: { type: "number", exclusiveMinimum: 0 },
    previousNormalized: { type: "number", exclusiveMinimum: 0 },
    nextNormalized: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "sampleConcentration",
    "referenceConcentration",
    "previousNormalized",
    "nextNormalized",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalized: { type: "number" },
    geometricNeighborBaseline: { type: "number" },
    anomaly: { type: "number" },
  },
  required: ["normalized", "geometricNeighborBaseline", "anomaly"],
} as const;
/** One normalized element and geometric-neighbor anomaly from explicitly sourced reference concentrations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sampleConcentration,
    referenceConcentration,
    previousNormalized,
    nextNormalized,
  } = request;
  const compute = (): Output => {
    H.domain(sampleConcentration >= 0);
    H.positive(referenceConcentration);
    H.positive(previousNormalized);
    H.positive(nextNormalized);
    return {
      normalized: sampleConcentration / referenceConcentration,
      geometricNeighborBaseline: Math.sqrt(previousNormalized * nextNormalized),
      anomaly:
        sampleConcentration /
        (referenceConcentration *
          Math.sqrt(previousNormalized * nextNormalized)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleConcentration: 12,
    referenceConcentration: 3,
    previousNormalized: 2,
    nextNormalized: 8,
  },
  output: { normalized: 4, geometricNeighborBaseline: 4, anomaly: 1 },
} satisfies ToolExample<Input, Output>;
export const rareEarthChondriteNormalizedOneElementTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/rare-earth-chondrite-normalized-one-element",
      title: "Rare Earth Chondrite Normalized One Element Tool",
      description:
        "One normalized element and geometric-neighbor anomaly from explicitly sourced reference concentrations.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sampleConcentration: { type: "number", minimum: 0 },
          referenceConcentration: { type: "number", exclusiveMinimum: 0 },
          previousNormalized: { type: "number", exclusiveMinimum: 0 },
          nextNormalized: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "sampleConcentration",
          "referenceConcentration",
          "previousNormalized",
          "nextNormalized",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalized: { type: "number" },
          geometricNeighborBaseline: { type: "number" },
          anomaly: { type: "number" },
        },
        required: ["normalized", "geometricNeighborBaseline", "anomaly"],
      },
      ports: {
        inputs: [
          {
            id: "sampleConcentration",
            label: "Sample Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceConcentration",
            label: "Reference Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "previousNormalized",
            label: "Previous Normalized",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nextNormalized",
            label: "Next Normalized",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "number" },
          },
          {
            id: "geometricNeighborBaseline",
            label: "Geometric Neighbor Baseline",
            valueType: { type: "number" },
          },
          { id: "anomaly", label: "Anomaly", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = rareEarthChondriteNormalizedOneElementTool.execute;
export default rareEarthChondriteNormalizedOneElementTool;
