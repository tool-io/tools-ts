import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reservoirVolume: number;
  readonly lineVolumes: readonly number[];
  readonly excludedVolume: number;
};
export type Output = {
  readonly grossLoopVolume: number;
  readonly countedLoopVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reservoirVolume: { type: "number", minimum: 0 },
    lineVolumes: { type: "array", maxItems: 256, items: { type: "number" } },
    excludedVolume: { type: "number", minimum: 0 },
  },
  required: ["reservoirVolume", "lineVolumes", "excludedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossLoopVolume: { type: "number" },
    countedLoopVolume: { type: "number" },
  },
  required: ["grossLoopVolume", "countedLoopVolume"],
} as const;
/** Supplied loop-volume inventory arithmetic without nutrient concentration or dosing recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reservoirVolume, lineVolumes, excludedVolume } = request;
  const compute = (): Output => {
    H.domain(
      reservoirVolume >= 0 &&
        lineVolumes.every((x) => x >= 0) &&
        excludedVolume >= 0 &&
        excludedVolume <=
          reservoirVolume + lineVolumes.reduce((a, b) => a + b, 0),
    );
    return {
      grossLoopVolume: reservoirVolume + lineVolumes.reduce((a, b) => a + b, 0),
      countedLoopVolume:
        reservoirVolume +
        lineVolumes.reduce((a, b) => a + b, 0) -
        excludedVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reservoirVolume: 100, lineVolumes: [10, 20], excludedVolume: 5 },
  output: { grossLoopVolume: 130, countedLoopVolume: 125 },
} satisfies ToolExample<Input, Output>;
export const nutrientLoopResidualVolumeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/nutrient-loop-residual-volume-term",
    title: "Nutrient Loop Residual Volume Term Tool",
    description:
      "Supplied loop-volume inventory arithmetic without nutrient concentration or dosing recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reservoirVolume: { type: "number", minimum: 0 },
        lineVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        excludedVolume: { type: "number", minimum: 0 },
      },
      required: ["reservoirVolume", "lineVolumes", "excludedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossLoopVolume: { type: "number" },
        countedLoopVolume: { type: "number" },
      },
      required: ["grossLoopVolume", "countedLoopVolume"],
    },
    ports: {
      inputs: [
        {
          id: "reservoirVolume",
          label: "Reservoir Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lineVolumes",
          label: "Line Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "excludedVolume",
          label: "Excluded Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossLoopVolume",
          label: "Gross Loop Volume",
          valueType: { type: "number" },
        },
        {
          id: "countedLoopVolume",
          label: "Counted Loop Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutrientLoopResidualVolumeTermTool.execute;
export default nutrientLoopResidualVolumeTermTool;
