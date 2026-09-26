import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVolume: number;
  readonly firstConcentration: number;
  readonly totalVolume: number;
  readonly totalMass: number;
};
export type Output = {
  readonly firstMass: number;
  readonly volumeShare: number;
  readonly massShare: number;
  readonly enrichment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVolume: { type: "number", minimum: 0 },
    firstConcentration: { type: "number", minimum: 0 },
    totalVolume: { type: "number", exclusiveMinimum: 0 },
    totalMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstVolume", "firstConcentration", "totalVolume", "totalMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMass: { type: "number" },
    volumeShare: { type: "number" },
    massShare: { type: "number" },
    enrichment: { type: "number" },
  },
  required: ["firstMass", "volumeShare", "massShare", "enrichment"],
} as const;
/** Consistent mass/volume units must be supplied, e.g. m3 with g/m3; no hidden concentration conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstVolume, firstConcentration, totalVolume, totalMass } = request;
  const compute = (): Output => {
    H.domain(
      firstVolume >= 0 &&
        firstVolume <= totalVolume &&
        firstConcentration >= 0 &&
        firstVolume * firstConcentration <= totalMass,
    );
    H.positive(totalVolume);
    H.positive(totalMass);
    return {
      firstMass: firstVolume * firstConcentration,
      volumeShare: firstVolume / totalVolume,
      massShare: (firstVolume * firstConcentration) / totalMass,
      enrichment: (firstConcentration * totalVolume) / totalMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstVolume: 10,
    firstConcentration: 3,
    totalVolume: 100,
    totalMass: 100,
  },
  output: { firstMass: 30, volumeShare: 0.1, massShare: 0.3, enrichment: 3 },
} satisfies ToolExample<Input, Output>;
export const stormwaterFirstFlushMassShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-engineering/stormwater-first-flush-mass-share-term",
    title: "Stormwater First Flush Mass Share Term Tool",
    description:
      "Consistent mass/volume units must be supplied, e.g. m3 with g/m3; no hidden concentration conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstVolume: { type: "number", minimum: 0 },
        firstConcentration: { type: "number", minimum: 0 },
        totalVolume: { type: "number", exclusiveMinimum: 0 },
        totalMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstVolume",
        "firstConcentration",
        "totalVolume",
        "totalMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstMass: { type: "number" },
        volumeShare: { type: "number" },
        massShare: { type: "number" },
        enrichment: { type: "number" },
      },
      required: ["firstMass", "volumeShare", "massShare", "enrichment"],
    },
    ports: {
      inputs: [
        {
          id: "firstVolume",
          label: "First Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstConcentration",
          label: "First Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalVolume",
          label: "Total Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalMass",
          label: "Total Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "firstMass", label: "First Mass", valueType: { type: "number" } },
        {
          id: "volumeShare",
          label: "Volume Share",
          valueType: { type: "number" },
        },
        { id: "massShare", label: "Mass Share", valueType: { type: "number" } },
        {
          id: "enrichment",
          label: "Enrichment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = stormwaterFirstFlushMassShareTermTool.execute;
export default stormwaterFirstFlushMassShareTermTool;
