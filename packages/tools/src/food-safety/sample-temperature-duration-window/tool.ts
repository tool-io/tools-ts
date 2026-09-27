import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedStart: number;
  readonly observedEnd: number;
  readonly suppliedWindowStart: number;
  readonly suppliedWindowEnd: number;
  readonly measuredTemperature: number;
  readonly suppliedLowerTemperature: number;
  readonly suppliedUpperTemperature: number;
};
export type Output = {
  readonly overlapDuration: number;
  readonly temperatureInside: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedStart: { type: "number" },
    observedEnd: { type: "number" },
    suppliedWindowStart: { type: "number" },
    suppliedWindowEnd: { type: "number" },
    measuredTemperature: { type: "number" },
    suppliedLowerTemperature: { type: "number" },
    suppliedUpperTemperature: { type: "number" },
  },
  required: [
    "observedStart",
    "observedEnd",
    "suppliedWindowStart",
    "suppliedWindowEnd",
    "measuredTemperature",
    "suppliedLowerTemperature",
    "suppliedUpperTemperature",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDuration: { type: "number" },
    temperatureInside: { type: "boolean" },
  },
  required: ["overlapDuration", "temperatureInside"],
} as const;
/** Inspect supplied observation/window geometry and one explicit temperature range; no food-safety limits or safety verdict are inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    observedStart,
    observedEnd,
    suppliedWindowStart,
    suppliedWindowEnd,
    measuredTemperature,
    suppliedLowerTemperature,
    suppliedUpperTemperature,
  } = request;
  const compute = (): Output => {
    H.domain(
      observedStart <= observedEnd &&
        suppliedWindowStart <= suppliedWindowEnd &&
        suppliedLowerTemperature <= suppliedUpperTemperature,
    );
    return {
      overlapDuration: Math.max(
        0,
        Math.min(observedEnd, suppliedWindowEnd) -
          Math.max(observedStart, suppliedWindowStart),
      ),
      temperatureInside:
        measuredTemperature >= suppliedLowerTemperature &&
        measuredTemperature <= suppliedUpperTemperature,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedStart: 0,
    observedEnd: 20,
    suppliedWindowStart: 10,
    suppliedWindowEnd: 30,
    measuredTemperature: 5,
    suppliedLowerTemperature: 0,
    suppliedUpperTemperature: 10,
  },
  output: { overlapDuration: 10, temperatureInside: true },
} satisfies ToolExample<Input, Output>;
export const sampleTemperatureDurationWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/sample-temperature-duration-window",
    title: "Sample Temperature Duration Window Tool",
    description:
      "Inspect supplied observation/window geometry and one explicit temperature range; no food-safety limits or safety verdict are inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedStart: { type: "number" },
        observedEnd: { type: "number" },
        suppliedWindowStart: { type: "number" },
        suppliedWindowEnd: { type: "number" },
        measuredTemperature: { type: "number" },
        suppliedLowerTemperature: { type: "number" },
        suppliedUpperTemperature: { type: "number" },
      },
      required: [
        "observedStart",
        "observedEnd",
        "suppliedWindowStart",
        "suppliedWindowEnd",
        "measuredTemperature",
        "suppliedLowerTemperature",
        "suppliedUpperTemperature",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDuration: { type: "number" },
        temperatureInside: { type: "boolean" },
      },
      required: ["overlapDuration", "temperatureInside"],
    },
    ports: {
      inputs: [
        {
          id: "observedStart",
          label: "Observed Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedEnd",
          label: "Observed End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWindowStart",
          label: "Supplied Window Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWindowEnd",
          label: "Supplied Window End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredTemperature",
          label: "Measured Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLowerTemperature",
          label: "Supplied Lower Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedUpperTemperature",
          label: "Supplied Upper Temperature",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          valueType: { type: "number" },
        },
        {
          id: "temperatureInside",
          label: "Temperature Inside",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleTemperatureDurationWindowTool.execute;
export default sampleTemperatureDurationWindowTool;
