import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startTimes: readonly number[];
  readonly endTimes: readonly number[];
  readonly supportedDurations: readonly number[];
};
export type Output = {
  readonly totalDuration: number;
  readonly supportedDuration: number;
  readonly missingDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    endTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    supportedDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["startTimes", "endTimes", "supportedDurations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalDuration: { type: "number" },
    supportedDuration: { type: "number" },
    missingDuration: { type: "number" },
  },
  required: ["totalDuration", "supportedDuration", "missingDuration"],
} as const;
/** Sum explicitly nonoverlapping temporal sampling cells; overlapping input records are not merged. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startTimes, endTimes, supportedDurations } = request;
  const compute = (): Output => {
    H.sameLength(startTimes, endTimes);
    H.sameLength(startTimes, supportedDurations);
    H.domain(
      startTimes.every(
        (x, i) =>
          endTimes[i] >= x &&
          supportedDurations[i] >= 0 &&
          supportedDurations[i] <= endTimes[i] - x,
      ),
    );
    return (() => {
      const totalDuration = startTimes.reduce(
          (s, x, i) => s + endTimes[i] - x,
          0,
        ),
        supportedDuration = supportedDurations.reduce((a, b) => a + b, 0);
      return {
        totalDuration,
        supportedDuration,
        missingDuration: totalDuration - supportedDuration,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startTimes: [0, 10], endTimes: [5, 20], supportedDurations: [3, 8] },
  output: { totalDuration: 15, supportedDuration: 11, missingDuration: 4 },
} satisfies ToolExample<Input, Output>;
export const ecologicalTimeSupportGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/ecological-time-support-gap",
    title: "Ecological Time Support Gap Tool",
    description:
      "Sum explicitly nonoverlapping temporal sampling cells; overlapping input records are not merged.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startTimes: { type: "array", maxItems: 256, items: { type: "number" } },
        endTimes: { type: "array", maxItems: 256, items: { type: "number" } },
        supportedDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["startTimes", "endTimes", "supportedDurations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalDuration: { type: "number" },
        supportedDuration: { type: "number" },
        missingDuration: { type: "number" },
      },
      required: ["totalDuration", "supportedDuration", "missingDuration"],
    },
    ports: {
      inputs: [
        {
          id: "startTimes",
          label: "Start Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "endTimes",
          label: "End Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "supportedDurations",
          label: "Supported Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "totalDuration",
          label: "Total Duration",
          valueType: { type: "number" },
        },
        {
          id: "supportedDuration",
          label: "Supported Duration",
          valueType: { type: "number" },
        },
        {
          id: "missingDuration",
          label: "Missing Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ecologicalTimeSupportGapTool.execute;
export default ecologicalTimeSupportGapTool;
