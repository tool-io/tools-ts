import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceConcentration: number;
  readonly sourceAliquotVolume: number;
  readonly dilutionFactors: readonly number[];
  readonly recordedFinalConcentration: number;
  readonly recordedFinalVolume: number;
};
export type Output = {
  readonly recordedDilutionFactor: number;
  readonly expectedFinalVolume: number;
  readonly volumeResidual: number;
  readonly massResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceConcentration: { type: "number" },
    sourceAliquotVolume: { type: "number", exclusiveMinimum: 0 },
    dilutionFactors: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    recordedFinalConcentration: { type: "number" },
    recordedFinalVolume: { type: "number", minimum: 0 },
  },
  required: [
    "sourceConcentration",
    "sourceAliquotVolume",
    "dilutionFactors",
    "recordedFinalConcentration",
    "recordedFinalVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDilutionFactor: { type: "number" },
    expectedFinalVolume: { type: "number" },
    volumeResidual: { type: "number" },
    massResidual: { type: "number" },
  },
  required: [
    "recordedDilutionFactor",
    "expectedFinalVolume",
    "volumeResidual",
    "massResidual",
  ],
} as const;
/** Compare recorded extract concentration/volume mass closure and explicit serial dilution records under full aliquot transfer assumptions; no laboratory procedure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sourceConcentration,
    sourceAliquotVolume,
    dilutionFactors,
    recordedFinalConcentration,
    recordedFinalVolume,
  } = request;
  const compute = (): Output => {
    H.positive(sourceAliquotVolume);
    H.domain(recordedFinalVolume >= 0 && dilutionFactors.every((x) => x >= 1));
    const recordedDilutionFactor = dilutionFactors.reduce((a, b) => a * b, 1),
      expectedFinalVolume = sourceAliquotVolume * recordedDilutionFactor;
    return {
      recordedDilutionFactor,
      expectedFinalVolume,
      volumeResidual: recordedFinalVolume - expectedFinalVolume,
      massResidual:
        recordedFinalConcentration * recordedFinalVolume -
        sourceConcentration * sourceAliquotVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceConcentration: 20,
    sourceAliquotVolume: 2,
    dilutionFactors: [2, 5],
    recordedFinalConcentration: 2.1,
    recordedFinalVolume: 20,
  },
  output: {
    recordedDilutionFactor: 10,
    expectedFinalVolume: 20,
    volumeResidual: 0,
    massResidual: 2,
  },
} satisfies ToolExample<Input, Output>;
export const soilExtractDilutionResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/soil-extract-dilution-residual",
    title: "Soil Extract Dilution Residual Tool",
    description:
      "Compare recorded extract concentration/volume mass closure and explicit serial dilution records under full aliquot transfer assumptions; no laboratory procedure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceConcentration: { type: "number" },
        sourceAliquotVolume: { type: "number", exclusiveMinimum: 0 },
        dilutionFactors: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        recordedFinalConcentration: { type: "number" },
        recordedFinalVolume: { type: "number", minimum: 0 },
      },
      required: [
        "sourceConcentration",
        "sourceAliquotVolume",
        "dilutionFactors",
        "recordedFinalConcentration",
        "recordedFinalVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDilutionFactor: { type: "number" },
        expectedFinalVolume: { type: "number" },
        volumeResidual: { type: "number" },
        massResidual: { type: "number" },
      },
      required: [
        "recordedDilutionFactor",
        "expectedFinalVolume",
        "volumeResidual",
        "massResidual",
      ],
    },
    ports: {
      inputs: [
        {
          id: "sourceConcentration",
          label: "Source Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceAliquotVolume",
          label: "Source Aliquot Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dilutionFactors",
          label: "Dilution Factors",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "recordedFinalConcentration",
          label: "Recorded Final Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedFinalVolume",
          label: "Recorded Final Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recordedDilutionFactor",
          label: "Recorded Dilution Factor",
          valueType: { type: "number" },
        },
        {
          id: "expectedFinalVolume",
          label: "Expected Final Volume",
          valueType: { type: "number" },
        },
        {
          id: "volumeResidual",
          label: "Volume Residual",
          valueType: { type: "number" },
        },
        {
          id: "massResidual",
          label: "Mass Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilExtractDilutionResidualTool.execute;
export default soilExtractDilutionResidualTool;
