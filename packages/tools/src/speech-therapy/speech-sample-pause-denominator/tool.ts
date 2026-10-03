import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalSeconds: number;
  readonly pauseSeconds: number;
  readonly countedUnits: number;
  readonly excludePauses: boolean;
};
export type Output = {
  readonly denominatorSeconds: number;
  readonly unitsPerSecond: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalSeconds: { type: "number", exclusiveMinimum: 0 },
    pauseSeconds: { type: "number" },
    countedUnits: { type: "integer", minimum: 0 },
    excludePauses: { type: "boolean" },
  },
  required: ["totalSeconds", "pauseSeconds", "countedUnits", "excludePauses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorSeconds: { type: "number" },
    unitsPerSecond: { type: "number" },
  },
  required: ["denominatorSeconds", "unitsPerSecond"],
} as const;
/** Compare supplied counts against elapsed or pause-excluded speech sample time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalSeconds, pauseSeconds, countedUnits, excludePauses } = request;
  const compute = (): Output => {
    H.positive(totalSeconds);
    H.integer(countedUnits, 0);
    H.domain(
      pauseSeconds >= 0 &&
        pauseSeconds <= totalSeconds &&
        (!excludePauses || pauseSeconds < totalSeconds),
    );
    return {
      denominatorSeconds: totalSeconds - (excludePauses ? pauseSeconds : 0),
      unitsPerSecond:
        countedUnits / (totalSeconds - (excludePauses ? pauseSeconds : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalSeconds: 60,
    pauseSeconds: 20,
    countedUnits: 80,
    excludePauses: true,
  },
  output: { denominatorSeconds: 40, unitsPerSecond: 2 },
} satisfies ToolExample<Input, Output>;
export const speechSamplePauseDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/speech-sample-pause-denominator",
    title: "Speech Sample Pause Denominator Tool",
    description:
      "Compare supplied counts against elapsed or pause-excluded speech sample time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalSeconds: { type: "number", exclusiveMinimum: 0 },
        pauseSeconds: { type: "number" },
        countedUnits: { type: "integer", minimum: 0 },
        excludePauses: { type: "boolean" },
      },
      required: [
        "totalSeconds",
        "pauseSeconds",
        "countedUnits",
        "excludePauses",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorSeconds: { type: "number" },
        unitsPerSecond: { type: "number" },
      },
      required: ["denominatorSeconds", "unitsPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "totalSeconds",
          label: "Total Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pauseSeconds",
          label: "Pause Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "countedUnits",
          label: "Counted Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludePauses",
          label: "Exclude Pauses",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominatorSeconds",
          label: "Denominator Seconds",
          valueType: { type: "number" },
        },
        {
          id: "unitsPerSecond",
          label: "Units Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = speechSamplePauseDenominatorTool.execute;
export default speechSamplePauseDenominatorTool;
