import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startFlowM3PerSecond: number;
  readonly endFlowM3PerSecond: number;
  readonly durationSeconds: number;
};
export type Output = { readonly meanFlow: number; readonly volumeM3: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startFlowM3PerSecond: { type: "number" },
    endFlowM3PerSecond: { type: "number" },
    durationSeconds: { type: "number", minimum: 0 },
  },
  required: ["startFlowM3PerSecond", "endFlowM3PerSecond", "durationSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meanFlow: { type: "number" }, volumeM3: { type: "number" } },
  required: ["meanFlow", "volumeM3"],
} as const;
/** Signed volume under one linearly interpolated flow segment; negative flows remain valid for reversing channels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startFlowM3PerSecond, endFlowM3PerSecond, durationSeconds } = request;
  const compute = (): Output => {
    H.domain(durationSeconds >= 0);
    return {
      meanFlow: (startFlowM3PerSecond + endFlowM3PerSecond) / 2,
      volumeM3:
        ((startFlowM3PerSecond + endFlowM3PerSecond) * durationSeconds) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startFlowM3PerSecond: 2,
    endFlowM3PerSecond: 6,
    durationSeconds: 3600,
  },
  output: { meanFlow: 4, volumeM3: 14400 },
} satisfies ToolExample<Input, Output>;
export const hydrographSegmentVolumeTrapezoidTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/hydrograph-segment-volume-trapezoid",
    title: "Hydrograph Segment Volume Trapezoid Tool",
    description:
      "Signed volume under one linearly interpolated flow segment; negative flows remain valid for reversing channels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startFlowM3PerSecond: { type: "number" },
        endFlowM3PerSecond: { type: "number" },
        durationSeconds: { type: "number", minimum: 0 },
      },
      required: [
        "startFlowM3PerSecond",
        "endFlowM3PerSecond",
        "durationSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanFlow: { type: "number" },
        volumeM3: { type: "number" },
      },
      required: ["meanFlow", "volumeM3"],
    },
    ports: {
      inputs: [
        {
          id: "startFlowM3PerSecond",
          label: "Start Flow M3Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endFlowM3PerSecond",
          label: "End Flow M3Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        { id: "meanFlow", label: "Mean Flow", valueType: { type: "number" } },
        { id: "volumeM3", label: "Volume M3", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hydrographSegmentVolumeTrapezoidTool.execute;
export default hydrographSegmentVolumeTrapezoidTool;
