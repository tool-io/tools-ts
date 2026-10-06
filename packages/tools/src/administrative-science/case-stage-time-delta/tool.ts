import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stageEntryTimestampSeconds: number;
  readonly stageExitTimestampSeconds: number;
  readonly pausedSeconds: number;
};
export type Output = {
  readonly elapsedSeconds: number;
  readonly activeSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stageEntryTimestampSeconds: { type: "number" },
    stageExitTimestampSeconds: { type: "number" },
    pausedSeconds: { type: "number", minimum: 0 },
  },
  required: [
    "stageEntryTimestampSeconds",
    "stageExitTimestampSeconds",
    "pausedSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsedSeconds: { type: "number" },
    activeSeconds: { type: "number" },
  },
  required: ["elapsedSeconds", "activeSeconds"],
} as const;
/** Measure a recorded case-stage interval and subtract an already deduplicated pause duration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    stageEntryTimestampSeconds,
    stageExitTimestampSeconds,
    pausedSeconds,
  } = request;
  const compute = (): Output => {
    H.domain(
      stageExitTimestampSeconds >= stageEntryTimestampSeconds &&
        pausedSeconds >= 0 &&
        pausedSeconds <= stageExitTimestampSeconds - stageEntryTimestampSeconds,
      "stageExitTimestampSeconds",
    );
    return {
      elapsedSeconds: stageExitTimestampSeconds - stageEntryTimestampSeconds,
      activeSeconds:
        stageExitTimestampSeconds - stageEntryTimestampSeconds - pausedSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stageEntryTimestampSeconds: 1000,
    stageExitTimestampSeconds: 1600,
    pausedSeconds: 120,
  },
  output: { elapsedSeconds: 600, activeSeconds: 480 },
} satisfies ToolExample<Input, Output>;
export const caseStageTimeDeltaTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/case-stage-time-delta",
    title: "Case Stage Time Delta",
    description:
      "Measure a recorded case-stage interval and subtract an already deduplicated pause duration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stageEntryTimestampSeconds: { type: "number" },
        stageExitTimestampSeconds: { type: "number" },
        pausedSeconds: { type: "number", minimum: 0 },
      },
      required: [
        "stageEntryTimestampSeconds",
        "stageExitTimestampSeconds",
        "pausedSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsedSeconds: { type: "number" },
        activeSeconds: { type: "number" },
      },
      required: ["elapsedSeconds", "activeSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "stageEntryTimestampSeconds",
          label: "Stage Entry Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stageExitTimestampSeconds",
          label: "Stage Exit Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pausedSeconds",
          label: "Paused Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "elapsedSeconds",
          label: "Elapsed Seconds",
          valueType: { type: "number" },
        },
        {
          id: "activeSeconds",
          label: "Active Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = caseStageTimeDeltaTool.execute;
export default caseStageTimeDeltaTool;
