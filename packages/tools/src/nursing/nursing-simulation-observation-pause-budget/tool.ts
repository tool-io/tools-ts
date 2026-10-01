import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stationMinutes: number;
  readonly briefingMinutes: number;
  readonly pauseMinutes: number;
  readonly debriefMinutes: number;
  readonly observationOverlap: number;
};
export type Output = {
  readonly activeObservation: number;
  readonly excludedUnion: number;
  readonly observationShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stationMinutes: { type: "number", exclusiveMinimum: 0 },
    briefingMinutes: { type: "number", minimum: 0 },
    pauseMinutes: { type: "number", minimum: 0 },
    debriefMinutes: { type: "number", minimum: 0 },
    observationOverlap: { type: "number", minimum: 0 },
  },
  required: [
    "stationMinutes",
    "briefingMinutes",
    "pauseMinutes",
    "debriefMinutes",
    "observationOverlap",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activeObservation: { type: "number" },
    excludedUnion: { type: "number" },
    observationShare: { type: "number" },
  },
  required: ["activeObservation", "excludedUnion", "observationShare"],
} as const;
/** Calculate nursing simulation observation pause budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    stationMinutes,
    briefingMinutes,
    pauseMinutes,
    debriefMinutes,
    observationOverlap,
  } = request;
  const compute = (): Output => {
    H.positive(stationMinutes);
    H.domain(
      briefingMinutes >= 0 &&
        pauseMinutes >= 0 &&
        debriefMinutes >= 0 &&
        observationOverlap >= 0 &&
        observationOverlap <= Math.min(briefingMinutes, pauseMinutes) &&
        briefingMinutes + pauseMinutes + debriefMinutes - observationOverlap <=
          stationMinutes,
    );
    return {
      activeObservation:
        stationMinutes -
        briefingMinutes -
        pauseMinutes -
        debriefMinutes +
        observationOverlap,
      excludedUnion:
        briefingMinutes + pauseMinutes + debriefMinutes - observationOverlap,
      observationShare:
        (stationMinutes -
          briefingMinutes -
          pauseMinutes -
          debriefMinutes +
          observationOverlap) /
        stationMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stationMinutes: 60,
    briefingMinutes: 10,
    pauseMinutes: 5,
    debriefMinutes: 10,
    observationOverlap: 5,
  },
  output: {
    activeObservation: 40,
    excludedUnion: 20,
    observationShare: 0.6666666666666666,
  },
} satisfies ToolExample<Input, Output>;
export const nursingSimulationObservationPauseBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nursing/nursing-simulation-observation-pause-budget",
      title: "Nursing Simulation Observation Pause Budget Tool",
      description:
        "Calculate nursing simulation observation pause budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stationMinutes: { type: "number", exclusiveMinimum: 0 },
          briefingMinutes: { type: "number", minimum: 0 },
          pauseMinutes: { type: "number", minimum: 0 },
          debriefMinutes: { type: "number", minimum: 0 },
          observationOverlap: { type: "number", minimum: 0 },
        },
        required: [
          "stationMinutes",
          "briefingMinutes",
          "pauseMinutes",
          "debriefMinutes",
          "observationOverlap",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activeObservation: { type: "number" },
          excludedUnion: { type: "number" },
          observationShare: { type: "number" },
        },
        required: ["activeObservation", "excludedUnion", "observationShare"],
      },
      ports: {
        inputs: [
          {
            id: "stationMinutes",
            label: "Station Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "briefingMinutes",
            label: "Briefing Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pauseMinutes",
            label: "Pause Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "debriefMinutes",
            label: "Debrief Minutes",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observationOverlap",
            label: "Observation Overlap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "activeObservation",
            label: "Active Observation",
            valueType: { type: "number" },
          },
          {
            id: "excludedUnion",
            label: "Excluded Union",
            valueType: { type: "number" },
          },
          {
            id: "observationShare",
            label: "Observation Share",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nursingSimulationObservationPauseBudgetTool.execute;
export default nursingSimulationObservationPauseBudgetTool;
