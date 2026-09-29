import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly discharge: number;
  readonly interval: number;
};
export type Output = { readonly volume: number; readonly firstMoment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    discharge: { type: "number", minimum: 0 },
    interval: { type: "number", minimum: 0 },
  },
  required: ["time", "discharge", "interval"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volume: { type: "number" }, firstMoment: { type: "number" } },
  required: ["volume", "firstMoment"],
} as const;
/** Return one rectangular hydrograph quadrature volume and its time moment on an explicit origin. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time, discharge, interval } = request;
  const compute = (): Output => {
    H.domain(discharge >= 0 && interval >= 0);
    return {
      volume: discharge * interval,
      firstMoment: time * discharge * interval,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { time: 4, discharge: 3, interval: 2 },
  output: { volume: 6, firstMoment: 24 },
} satisfies ToolExample<Input, Output>;
export const hydrographTimeCentroidTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/hydrograph-time-centroid-term",
    title: "Hydrograph Time Centroid Term Tool",
    description:
      "Return one rectangular hydrograph quadrature volume and its time moment on an explicit origin.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        discharge: { type: "number", minimum: 0 },
        interval: { type: "number", minimum: 0 },
      },
      required: ["time", "discharge", "interval"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        volume: { type: "number" },
        firstMoment: { type: "number" },
      },
      required: ["volume", "firstMoment"],
    },
    ports: {
      inputs: [
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "discharge",
          label: "Discharge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "interval",
          label: "Interval",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "volume", label: "Volume", valueType: { type: "number" } },
        {
          id: "firstMoment",
          label: "First Moment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hydrographTimeCentroidTermTool.execute;
export default hydrographTimeCentroidTermTool;
