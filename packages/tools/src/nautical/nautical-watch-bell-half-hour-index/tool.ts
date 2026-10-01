import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly minutesSinceWatchStart: number };
export type Output = {
  readonly bells: number;
  readonly exactBoundary: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minutesSinceWatchStart: { type: "integer", minimum: 0, maximum: 240 },
  },
  required: ["minutesSinceWatchStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bells: { type: "integer" },
    exactBoundary: { type: "boolean" },
  },
  required: ["bells", "exactBoundary"],
} as const;
/** Map elapsed minutes in an explicit four-hour watch to half-hour bell count, with zero at the watch start. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { minutesSinceWatchStart } = request;
  const compute = (): Output => {
    H.integer(minutesSinceWatchStart, 0, 240);
    const halfHours = Math.floor(minutesSinceWatchStart / 30);
    return {
      bells: halfHours === 0 ? 0 : halfHours,
      exactBoundary: minutesSinceWatchStart % 30 === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { minutesSinceWatchStart: 90 },
  output: { bells: 3, exactBoundary: true },
} satisfies ToolExample<Input, Output>;
export const nauticalWatchBellHalfHourIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/nautical-watch-bell-half-hour-index",
    title: "Nautical Watch Bell Half Hour Index Tool",
    description:
      "Map elapsed minutes in an explicit four-hour watch to half-hour bell count, with zero at the watch start.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        minutesSinceWatchStart: { type: "integer", minimum: 0, maximum: 240 },
      },
      required: ["minutesSinceWatchStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bells: { type: "integer" },
        exactBoundary: { type: "boolean" },
      },
      required: ["bells", "exactBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "minutesSinceWatchStart",
          label: "Minutes Since Watch Start",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "bells", label: "Bells", valueType: { type: "integer" } },
        {
          id: "exactBoundary",
          label: "Exact Boundary",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = nauticalWatchBellHalfHourIndexTool.execute;
export default nauticalWatchBellHalfHourIndexTool;
