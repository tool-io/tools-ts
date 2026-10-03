import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstVolume: number;
  readonly secondVolume: number;
  readonly firstTime: number;
  readonly secondTime: number;
};
export type Output = {
  readonly volumeIncrement: number;
  readonly meanFlow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstVolume: { type: "number" },
    secondVolume: { type: "number" },
    firstTime: { type: "number" },
    secondTime: { type: "number" },
  },
  required: ["firstVolume", "secondVolume", "firstTime", "secondTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    volumeIncrement: { type: "number" },
    meanFlow: { type: "number" },
  },
  required: ["volumeIncrement", "meanFlow"],
} as const;
/** Compute one supplied research trace increment and mean flow without a maneuver quality or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstVolume, secondVolume, firstTime, secondTime } = request;
  const compute = (): Output => {
    H.domain(secondTime > firstTime);
    return {
      volumeIncrement: secondVolume - firstVolume,
      meanFlow: (secondVolume - firstVolume) / (secondTime - firstTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstVolume: 1, secondVolume: 3, firstTime: 0, secondTime: 2 },
  output: { volumeIncrement: 2, meanFlow: 1 },
} satisfies ToolExample<Input, Output>;
export const spirometryTimeVolumeIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/spirometry-time-volume-increment",
    title: "Spirometry Time Volume Increment Tool",
    description:
      "Compute one supplied research trace increment and mean flow without a maneuver quality or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstVolume: { type: "number" },
        secondVolume: { type: "number" },
        firstTime: { type: "number" },
        secondTime: { type: "number" },
      },
      required: ["firstVolume", "secondVolume", "firstTime", "secondTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volumeIncrement: { type: "number" },
        meanFlow: { type: "number" },
      },
      required: ["volumeIncrement", "meanFlow"],
    },
    ports: {
      inputs: [
        {
          id: "firstVolume",
          label: "First Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondVolume",
          label: "Second Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstTime",
          label: "First Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTime",
          label: "Second Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeIncrement",
          label: "Volume Increment",
          valueType: { type: "number" },
        },
        { id: "meanFlow", label: "Mean Flow", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = spirometryTimeVolumeIncrementTool.execute;
export default spirometryTimeVolumeIncrementTool;
