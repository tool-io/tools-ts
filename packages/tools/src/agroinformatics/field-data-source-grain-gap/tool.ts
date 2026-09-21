import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceRowSeconds: number;
  readonly targetRowSeconds: number;
  readonly sourceRowMeters: number;
  readonly targetRowMeters: number;
};
export type Output = {
  readonly timeRatio: number;
  readonly spatialRatio: number;
  readonly timeGap: number;
  readonly spatialGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceRowSeconds: { type: "number", exclusiveMinimum: 0 },
    targetRowSeconds: { type: "number", exclusiveMinimum: 0 },
    sourceRowMeters: { type: "number", exclusiveMinimum: 0 },
    targetRowMeters: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "sourceRowSeconds",
    "targetRowSeconds",
    "sourceRowMeters",
    "targetRowMeters",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    timeRatio: { type: "number" },
    spatialRatio: { type: "number" },
    timeGap: { type: "number" },
    spatialGap: { type: "number" },
  },
  required: ["timeRatio", "spatialRatio", "timeGap", "spatialGap"],
} as const;
/** Calculate field data source grain gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sourceRowSeconds,
    targetRowSeconds,
    sourceRowMeters,
    targetRowMeters,
  } = request;
  const compute = (): Output => {
    H.positive(sourceRowSeconds);
    H.positive(targetRowSeconds);
    H.positive(sourceRowMeters);
    H.positive(targetRowMeters);
    return {
      timeRatio: sourceRowSeconds / targetRowSeconds,
      spatialRatio: sourceRowMeters / targetRowMeters,
      timeGap: sourceRowSeconds - targetRowSeconds,
      spatialGap: sourceRowMeters - targetRowMeters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceRowSeconds: 20,
    targetRowSeconds: 10,
    sourceRowMeters: 4,
    targetRowMeters: 2,
  },
  output: { timeRatio: 2, spatialRatio: 2, timeGap: 10, spatialGap: 2 },
} satisfies ToolExample<Input, Output>;
export const fieldDataSourceGrainGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroinformatics/field-data-source-grain-gap",
    title: "Field Data Source Grain Gap Tool",
    description:
      "Calculate field data source grain gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceRowSeconds: { type: "number", exclusiveMinimum: 0 },
        targetRowSeconds: { type: "number", exclusiveMinimum: 0 },
        sourceRowMeters: { type: "number", exclusiveMinimum: 0 },
        targetRowMeters: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "sourceRowSeconds",
        "targetRowSeconds",
        "sourceRowMeters",
        "targetRowMeters",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        timeRatio: { type: "number" },
        spatialRatio: { type: "number" },
        timeGap: { type: "number" },
        spatialGap: { type: "number" },
      },
      required: ["timeRatio", "spatialRatio", "timeGap", "spatialGap"],
    },
    ports: {
      inputs: [
        {
          id: "sourceRowSeconds",
          label: "Source Row Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetRowSeconds",
          label: "Target Row Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceRowMeters",
          label: "Source Row Meters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetRowMeters",
          label: "Target Row Meters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "timeRatio", label: "Time Ratio", valueType: { type: "number" } },
        {
          id: "spatialRatio",
          label: "Spatial Ratio",
          valueType: { type: "number" },
        },
        { id: "timeGap", label: "Time Gap", valueType: { type: "number" } },
        {
          id: "spatialGap",
          label: "Spatial Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fieldDataSourceGrainGapTool.execute;
export default fieldDataSourceGrainGapTool;
