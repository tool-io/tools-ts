import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pickTime: number;
  readonly recordingOrigin: number;
  readonly shotOrigin: number;
  readonly suppliedTravelTime: number;
};
export type Output = {
  readonly recordedOffset: number;
  readonly travelTime: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pickTime: { type: "number" },
    recordingOrigin: { type: "number" },
    shotOrigin: { type: "number" },
    suppliedTravelTime: { type: "number", minimum: 0 },
  },
  required: ["pickTime", "recordingOrigin", "shotOrigin", "suppliedTravelTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedOffset: { type: "number" },
    travelTime: { type: "number" },
    residual: { type: "number" },
  },
  required: ["recordedOffset", "travelTime", "residual"],
} as const;
/** Calculate seismic pick origin gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pickTime, recordingOrigin, shotOrigin, suppliedTravelTime } = request;
  const compute = (): Output => {
    H.domain(suppliedTravelTime >= 0);
    return {
      recordedOffset: pickTime - recordingOrigin,
      travelTime: pickTime - shotOrigin,
      residual: pickTime - shotOrigin - suppliedTravelTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pickTime: 20,
    recordingOrigin: 5,
    shotOrigin: 8,
    suppliedTravelTime: 10,
  },
  output: { recordedOffset: 15, travelTime: 12, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const seismicPickOriginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/seismic-pick-origin-gap",
    title: "Seismic Pick Origin Gap Tool",
    description:
      "Calculate seismic pick origin gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pickTime: { type: "number" },
        recordingOrigin: { type: "number" },
        shotOrigin: { type: "number" },
        suppliedTravelTime: { type: "number", minimum: 0 },
      },
      required: [
        "pickTime",
        "recordingOrigin",
        "shotOrigin",
        "suppliedTravelTime",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedOffset: { type: "number" },
        travelTime: { type: "number" },
        residual: { type: "number" },
      },
      required: ["recordedOffset", "travelTime", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "pickTime",
          label: "Pick Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordingOrigin",
          label: "Recording Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shotOrigin",
          label: "Shot Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTravelTime",
          label: "Supplied Travel Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recordedOffset",
          label: "Recorded Offset",
          valueType: { type: "number" },
        },
        {
          id: "travelTime",
          label: "Travel Time",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = seismicPickOriginGapTool.execute;
export default seismicPickOriginGapTool;
