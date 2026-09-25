import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstDay: number;
  readonly secondDay: number;
  readonly yearDays: number;
};
export type Output = {
  readonly forwardGap: number;
  readonly shortestSignedGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDay: { type: "integer", minimum: 0 },
    secondDay: { type: "integer", minimum: 0 },
    yearDays: { type: "integer", minimum: 1 },
  },
  required: ["firstDay", "secondDay", "yearDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardGap: { type: "integer" },
    shortestSignedGap: { type: "integer" },
  },
  required: ["forwardGap", "shortestSignedGap"],
} as const;
/** Cyclic ordinal-day difference in an explicit period, with a half-period tie retained positive; no hemisphere or season is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstDay, secondDay, yearDays } = request;
  const compute = (): Output => {
    H.integer(yearDays, 1);
    H.integer(firstDay, 0, yearDays - 1);
    H.integer(secondDay, 0, yearDays - 1);
    const r = (secondDay - firstDay) % yearDays,
      forwardGap = r < 0 ? r + yearDays : r;
    return {
      forwardGap,
      shortestSignedGap:
        forwardGap > yearDays / 2 ? forwardGap - yearDays : forwardGap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstDay: 350, secondDay: 10, yearDays: 365 },
  output: { forwardGap: 25, shortestSignedGap: 25 },
} satisfies ToolExample<Input, Output>;
export const phenologyEventCircularDayGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/phenology-event-circular-day-gap",
    title: "Phenology Event Circular Day Gap Tool",
    description:
      "Cyclic ordinal-day difference in an explicit period, with a half-period tie retained positive; no hemisphere or season is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstDay: { type: "integer", minimum: 0 },
        secondDay: { type: "integer", minimum: 0 },
        yearDays: { type: "integer", minimum: 1 },
      },
      required: ["firstDay", "secondDay", "yearDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forwardGap: { type: "integer" },
        shortestSignedGap: { type: "integer" },
      },
      required: ["forwardGap", "shortestSignedGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstDay",
          label: "First Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondDay",
          label: "Second Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "yearDays",
          label: "Year Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "forwardGap",
          label: "Forward Gap",
          valueType: { type: "integer" },
        },
        {
          id: "shortestSignedGap",
          label: "Shortest Signed Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = phenologyEventCircularDayGapTool.execute;
export default phenologyEventCircularDayGapTool;
