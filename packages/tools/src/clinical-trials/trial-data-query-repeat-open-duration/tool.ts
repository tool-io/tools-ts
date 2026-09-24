import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openTimes: readonly number[];
  readonly closeTimes: readonly number[];
  readonly now: number;
};
export type Output = {
  readonly closedDuration: number;
  readonly openDuration: number;
  readonly episodes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    closeTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    now: { type: "number" },
  },
  required: ["openTimes", "closeTimes", "now"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closedDuration: { type: "number" },
    openDuration: { type: "number" },
    episodes: { type: "integer" },
  },
  required: ["closedDuration", "openDuration", "episodes"],
} as const;
/** Sum supplied closed query episodes separately from a currently open episode. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openTimes, closeTimes, now } = request;
  const compute = (): Output => {
    H.domain(
      openTimes.length >= closeTimes.length &&
        openTimes.length <= closeTimes.length + 1 &&
        openTimes.every((x, i) => i === 0 || x >= closeTimes[i - 1]) &&
        closeTimes.every((x, i) => x >= openTimes[i]) &&
        openTimes.every((x) => x <= now) &&
        closeTimes.every((x) => x <= now),
    );
    return {
      closedDuration: closeTimes.reduce((a, x, i) => a + x - openTimes[i], 0),
      openDuration:
        openTimes.length > closeTimes.length
          ? now - openTimes[openTimes.length - 1]
          : 0,
      episodes: openTimes.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openTimes: [0, 10, 20], closeTimes: [5, 15], now: 25 },
  output: { closedDuration: 10, openDuration: 5, episodes: 3 },
} satisfies ToolExample<Input, Output>;
export const trialDataQueryRepeatOpenDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-data-query-repeat-open-duration",
    title: "Trial Data Query Repeat Open Duration Tool",
    description:
      "Sum supplied closed query episodes separately from a currently open episode.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openTimes: { type: "array", maxItems: 256, items: { type: "number" } },
        closeTimes: { type: "array", maxItems: 256, items: { type: "number" } },
        now: { type: "number" },
      },
      required: ["openTimes", "closeTimes", "now"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        closedDuration: { type: "number" },
        openDuration: { type: "number" },
        episodes: { type: "integer" },
      },
      required: ["closedDuration", "openDuration", "episodes"],
    },
    ports: {
      inputs: [
        {
          id: "openTimes",
          label: "Open Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "closeTimes",
          label: "Close Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "now",
          label: "Now",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "closedDuration",
          label: "Closed Duration",
          valueType: { type: "number" },
        },
        {
          id: "openDuration",
          label: "Open Duration",
          valueType: { type: "number" },
        },
        { id: "episodes", label: "Episodes", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = trialDataQueryRepeatOpenDurationTool.execute;
export default trialDataQueryRepeatOpenDurationTool;
