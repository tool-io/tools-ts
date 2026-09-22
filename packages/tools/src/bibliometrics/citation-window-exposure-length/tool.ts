import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publicationDay: number;
  readonly windowStart: number;
  readonly windowEnd: number;
  readonly observationEnd: number;
};
export type Output = {
  readonly exposedDays: number;
  readonly windowDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationDay: { type: "integer" },
    windowStart: { type: "integer" },
    windowEnd: { type: "integer" },
    observationEnd: { type: "integer" },
  },
  required: ["publicationDay", "windowStart", "windowEnd", "observationEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposedDays: { type: "integer" },
    windowDays: { type: "integer" },
  },
  required: ["exposedDays", "windowDays"],
} as const;
/** Intersect supplied half-open citation eligibility and observation windows without fetching citations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publicationDay, windowStart, windowEnd, observationEnd } = request;
  const compute = (): Output => {
    H.domain(windowStart <= windowEnd);
    return {
      exposedDays: Math.max(
        0,
        Math.min(windowEnd, observationEnd) -
          Math.max(windowStart, publicationDay),
      ),
      windowDays: windowEnd - windowStart,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    publicationDay: 10,
    windowStart: 0,
    windowEnd: 100,
    observationEnd: 80,
  },
  output: { exposedDays: 70, windowDays: 100 },
} satisfies ToolExample<Input, Output>;
export const citationWindowExposureLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/citation-window-exposure-length",
    title: "Citation Window Exposure Length Tool",
    description:
      "Intersect supplied half-open citation eligibility and observation windows without fetching citations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publicationDay: { type: "integer" },
        windowStart: { type: "integer" },
        windowEnd: { type: "integer" },
        observationEnd: { type: "integer" },
      },
      required: [
        "publicationDay",
        "windowStart",
        "windowEnd",
        "observationEnd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposedDays: { type: "integer" },
        windowDays: { type: "integer" },
      },
      required: ["exposedDays", "windowDays"],
    },
    ports: {
      inputs: [
        {
          id: "publicationDay",
          label: "Publication Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowStart",
          label: "Window Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "windowEnd",
          label: "Window End",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationEnd",
          label: "Observation End",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "exposedDays",
          label: "Exposed Days",
          valueType: { type: "integer" },
        },
        {
          id: "windowDays",
          label: "Window Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = citationWindowExposureLengthTool.execute;
export default citationWindowExposureLengthTool;
