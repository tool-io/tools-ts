import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedConcentration: number;
  readonly collectedVolume: number;
  readonly referenceConcentration: number;
  readonly durationMinutes: number;
};
export type Output = {
  readonly collectedMass: number;
  readonly clearanceVolumePerMinute: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedConcentration: { type: "number", minimum: 0 },
    collectedVolume: { type: "number", minimum: 0 },
    referenceConcentration: { type: "number", exclusiveMinimum: 0 },
    durationMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "collectedConcentration",
    "collectedVolume",
    "referenceConcentration",
    "durationMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedMass: { type: "number" },
    clearanceVolumePerMinute: { type: "number" },
  },
  required: ["collectedMass", "clearanceVolumePerMinute"],
} as const;
/** Research UV/(P*t) clearance identity from supplied observations, without filtration-marker assumptions or renal-function interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    collectedConcentration,
    collectedVolume,
    referenceConcentration,
    durationMinutes,
  } = request;
  const compute = (): Output => {
    H.domain(collectedConcentration >= 0 && collectedVolume >= 0);
    H.positive(referenceConcentration);
    H.positive(durationMinutes);
    return {
      collectedMass: collectedConcentration * collectedVolume,
      clearanceVolumePerMinute:
        (collectedConcentration * collectedVolume) /
        (referenceConcentration * durationMinutes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectedConcentration: 10,
    collectedVolume: 100,
    referenceConcentration: 2,
    durationMinutes: 50,
  },
  output: { collectedMass: 1000, clearanceVolumePerMinute: 10 },
} satisfies ToolExample<Input, Output>;
export const renalResearchClearanceVolumeTimeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nephrology/renal-research-clearance-volume-time-term",
      title: "Renal Research Clearance Volume Time Term Tool",
      description:
        "Research UV/(P*t) clearance identity from supplied observations, without filtration-marker assumptions or renal-function interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          collectedConcentration: { type: "number", minimum: 0 },
          collectedVolume: { type: "number", minimum: 0 },
          referenceConcentration: { type: "number", exclusiveMinimum: 0 },
          durationMinutes: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "collectedConcentration",
          "collectedVolume",
          "referenceConcentration",
          "durationMinutes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          collectedMass: { type: "number" },
          clearanceVolumePerMinute: { type: "number" },
        },
        required: ["collectedMass", "clearanceVolumePerMinute"],
      },
      ports: {
        inputs: [
          {
            id: "collectedConcentration",
            label: "Collected Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "collectedVolume",
            label: "Collected Volume",
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
            id: "durationMinutes",
            label: "Duration Minutes",
            required: true,
            valueType: { type: "number", unit: "min" },
          },
        ],
        outputs: [
          {
            id: "collectedMass",
            label: "Collected Mass",
            valueType: { type: "number" },
          },
          {
            id: "clearanceVolumePerMinute",
            label: "Clearance Volume Per Minute",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = renalResearchClearanceVolumeTimeTermTool.execute;
export default renalResearchClearanceVolumeTimeTermTool;
