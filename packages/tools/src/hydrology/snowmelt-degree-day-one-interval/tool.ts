import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly meanTemperature: number;
  readonly meltThreshold: number;
  readonly days: number;
  readonly degreeDayFactor: number;
};
export type Output = {
  readonly positiveDegreeDays: number;
  readonly melt: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanTemperature: { type: "number" },
    meltThreshold: { type: "number" },
    days: { type: "number", minimum: 0 },
    degreeDayFactor: { type: "number", minimum: 0 },
  },
  required: ["meanTemperature", "meltThreshold", "days", "degreeDayFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveDegreeDays: { type: "number" },
    melt: { type: "number" },
  },
  required: ["positiveDegreeDays", "melt"],
} as const;
/** Calculate snowmelt degree day one interval from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { meanTemperature, meltThreshold, days, degreeDayFactor } = request;
  const compute = (): Output => {
    H.domain(days >= 0 && degreeDayFactor >= 0);
    return {
      positiveDegreeDays: Math.max(0, meanTemperature - meltThreshold) * days,
      melt:
        Math.max(0, meanTemperature - meltThreshold) * days * degreeDayFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { meanTemperature: 5, meltThreshold: 0, days: 2, degreeDayFactor: 3 },
  output: { positiveDegreeDays: 10, melt: 30 },
} satisfies ToolExample<Input, Output>;
export const snowmeltDegreeDayOneIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/snowmelt-degree-day-one-interval",
    title: "Snowmelt Degree Day One Interval Tool",
    description:
      "Calculate snowmelt degree day one interval from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanTemperature: { type: "number" },
        meltThreshold: { type: "number" },
        days: { type: "number", minimum: 0 },
        degreeDayFactor: { type: "number", minimum: 0 },
      },
      required: ["meanTemperature", "meltThreshold", "days", "degreeDayFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveDegreeDays: { type: "number" },
        melt: { type: "number" },
      },
      required: ["positiveDegreeDays", "melt"],
    },
    ports: {
      inputs: [
        {
          id: "meanTemperature",
          label: "Mean Temperature",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "meltThreshold",
          label: "Melt Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "degreeDayFactor",
          label: "Degree Day Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "positiveDegreeDays",
          label: "Positive Degree Days",
          valueType: { type: "number" },
        },
        { id: "melt", label: "Melt", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = snowmeltDegreeDayOneIntervalTool.execute;
export default snowmeltDegreeDayOneIntervalTool;
