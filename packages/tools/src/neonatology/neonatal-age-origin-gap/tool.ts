import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly birthOrigin: number;
  readonly sourceOrigin: number;
  readonly timeUnitsPerDay: number;
};
export type Output = {
  readonly ageFromBirthDays: number;
  readonly ageFromSourceDays: number;
  readonly originGapDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    birthOrigin: { type: "number" },
    sourceOrigin: { type: "number" },
    timeUnitsPerDay: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["eventTime", "birthOrigin", "sourceOrigin", "timeUnitsPerDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageFromBirthDays: { type: "number" },
    ageFromSourceDays: { type: "number" },
    originGapDays: { type: "number" },
  },
  required: ["ageFromBirthDays", "ageFromSourceDays", "originGapDays"],
} as const;
/** Compare explicit research age origins and units without corrected-age or care guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, birthOrigin, sourceOrigin, timeUnitsPerDay } = request;
  const compute = (): Output => {
    H.positive(timeUnitsPerDay);
    return {
      ageFromBirthDays: (eventTime - birthOrigin) / timeUnitsPerDay,
      ageFromSourceDays: (eventTime - sourceOrigin) / timeUnitsPerDay,
      originGapDays: (sourceOrigin - birthOrigin) / timeUnitsPerDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventTime: 72,
    birthOrigin: 0,
    sourceOrigin: 24,
    timeUnitsPerDay: 24,
  },
  output: { ageFromBirthDays: 3, ageFromSourceDays: 2, originGapDays: 1 },
} satisfies ToolExample<Input, Output>;
export const neonatalAgeOriginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/neonatal-age-origin-gap",
    title: "Neonatal Age Origin Gap Tool",
    description:
      "Compare explicit research age origins and units without corrected-age or care guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "number" },
        birthOrigin: { type: "number" },
        sourceOrigin: { type: "number" },
        timeUnitsPerDay: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["eventTime", "birthOrigin", "sourceOrigin", "timeUnitsPerDay"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageFromBirthDays: { type: "number" },
        ageFromSourceDays: { type: "number" },
        originGapDays: { type: "number" },
      },
      required: ["ageFromBirthDays", "ageFromSourceDays", "originGapDays"],
    },
    ports: {
      inputs: [
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "birthOrigin",
          label: "Birth Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceOrigin",
          label: "Source Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeUnitsPerDay",
          label: "Time Units Per Day",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ageFromBirthDays",
          label: "Age From Birth Days",
          valueType: { type: "number" },
        },
        {
          id: "ageFromSourceDays",
          label: "Age From Source Days",
          valueType: { type: "number" },
        },
        {
          id: "originGapDays",
          label: "Origin Gap Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = neonatalAgeOriginGapTool.execute;
export default neonatalAgeOriginGapTool;
