import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roomConcentration: number;
  readonly roomHours: number;
  readonly otherConcentration: number;
  readonly otherHours: number;
  readonly occupancyWeight: number;
};
export type Output = {
  readonly weightedHours: number;
  readonly integratedExposure: number;
  readonly meanConcentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roomConcentration: { type: "number", minimum: 0 },
    roomHours: { type: "number", minimum: 0 },
    otherConcentration: { type: "number", minimum: 0 },
    otherHours: { type: "number", minimum: 0 },
    occupancyWeight: { type: "number", minimum: 0 },
  },
  required: [
    "roomConcentration",
    "roomHours",
    "otherConcentration",
    "otherHours",
    "occupancyWeight",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedHours: { type: "number" },
    integratedExposure: { type: "number" },
    meanConcentration: { type: "number" },
  },
  required: ["weightedHours", "integratedExposure", "meanConcentration"],
} as const;
/** Calculate radon exposure time weighted one room term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    roomConcentration,
    roomHours,
    otherConcentration,
    otherHours,
    occupancyWeight,
  } = request;
  const compute = (): Output => {
    H.domain(
      roomConcentration >= 0 &&
        otherConcentration >= 0 &&
        roomHours >= 0 &&
        otherHours >= 0 &&
        occupancyWeight >= 0 &&
        roomHours * occupancyWeight + otherHours > 0,
    );
    return {
      weightedHours: roomHours * occupancyWeight + otherHours,
      integratedExposure:
        roomConcentration * roomHours * occupancyWeight +
        otherConcentration * otherHours,
      meanConcentration:
        (roomConcentration * roomHours * occupancyWeight +
          otherConcentration * otherHours) /
        (roomHours * occupancyWeight + otherHours),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    roomConcentration: 100,
    roomHours: 10,
    otherConcentration: 20,
    otherHours: 5,
    occupancyWeight: 0.5,
  },
  output: { weightedHours: 10, integratedExposure: 600, meanConcentration: 60 },
} satisfies ToolExample<Input, Output>;
export const radonExposureTimeWeightedOneRoomTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-health/radon-exposure-time-weighted-one-room-term",
      title: "Radon Exposure Time Weighted One Room Term Tool",
      description:
        "Calculate radon exposure time weighted one room term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          roomConcentration: { type: "number", minimum: 0 },
          roomHours: { type: "number", minimum: 0 },
          otherConcentration: { type: "number", minimum: 0 },
          otherHours: { type: "number", minimum: 0 },
          occupancyWeight: { type: "number", minimum: 0 },
        },
        required: [
          "roomConcentration",
          "roomHours",
          "otherConcentration",
          "otherHours",
          "occupancyWeight",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weightedHours: { type: "number" },
          integratedExposure: { type: "number" },
          meanConcentration: { type: "number" },
        },
        required: ["weightedHours", "integratedExposure", "meanConcentration"],
      },
      ports: {
        inputs: [
          {
            id: "roomConcentration",
            label: "Room Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "roomHours",
            label: "Room Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "otherConcentration",
            label: "Other Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "otherHours",
            label: "Other Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "occupancyWeight",
            label: "Occupancy Weight",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "weightedHours",
            label: "Weighted Hours",
            valueType: { type: "number" },
          },
          {
            id: "integratedExposure",
            label: "Integrated Exposure",
            valueType: { type: "number" },
          },
          {
            id: "meanConcentration",
            label: "Mean Concentration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = radonExposureTimeWeightedOneRoomTermTool.execute;
export default radonExposureTimeWeightedOneRoomTermTool;
