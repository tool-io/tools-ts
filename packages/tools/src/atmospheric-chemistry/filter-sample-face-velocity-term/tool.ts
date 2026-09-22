import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowVolumePerSecond: number;
  readonly filterArea: number;
  readonly durationSeconds: number;
};
export type Output = {
  readonly faceVelocity: number;
  readonly sampledVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowVolumePerSecond: { type: "number", minimum: 0 },
    filterArea: { type: "number", exclusiveMinimum: 0 },
    durationSeconds: { type: "number", minimum: 0 },
  },
  required: ["flowVolumePerSecond", "filterArea", "durationSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    faceVelocity: { type: "number" },
    sampledVolume: { type: "number" },
  },
  required: ["faceVelocity", "sampledVolume"],
} as const;
/** Calculate filter sample face velocity term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowVolumePerSecond, filterArea, durationSeconds } = request;
  const compute = (): Output => {
    H.domain(flowVolumePerSecond >= 0 && durationSeconds >= 0);
    H.positive(filterArea);
    return {
      faceVelocity: flowVolumePerSecond / filterArea,
      sampledVolume: flowVolumePerSecond * durationSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flowVolumePerSecond: 0.01, filterArea: 0.02, durationSeconds: 600 },
  output: { faceVelocity: 0.5, sampledVolume: 6 },
} satisfies ToolExample<Input, Output>;
export const filterSampleFaceVelocityTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-chemistry/filter-sample-face-velocity-term",
    title: "Filter Sample Face Velocity Term Tool",
    description:
      "Calculate filter sample face velocity term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowVolumePerSecond: { type: "number", minimum: 0 },
        filterArea: { type: "number", exclusiveMinimum: 0 },
        durationSeconds: { type: "number", minimum: 0 },
      },
      required: ["flowVolumePerSecond", "filterArea", "durationSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        faceVelocity: { type: "number" },
        sampledVolume: { type: "number" },
      },
      required: ["faceVelocity", "sampledVolume"],
    },
    ports: {
      inputs: [
        {
          id: "flowVolumePerSecond",
          label: "Flow Volume Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "filterArea",
          label: "Filter Area",
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
        {
          id: "faceVelocity",
          label: "Face Velocity",
          valueType: { type: "number" },
        },
        {
          id: "sampledVolume",
          label: "Sampled Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = filterSampleFaceVelocityTermTool.execute;
export default filterSampleFaceVelocityTermTool;
