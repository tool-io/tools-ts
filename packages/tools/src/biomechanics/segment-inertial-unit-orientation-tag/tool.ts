import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly segmentId: string;
  readonly sensorId: string;
  readonly suppliedFrame: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentId: { type: "string", maxLength: 8192, minLength: 1 },
    sensorId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedFrame: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["segmentId", "sensorId", "suppliedFrame"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit segment inertial-sensor frame metadata without rotating measurements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentId, sensorId, suppliedFrame } = request;
  const compute = (): Output => {
    H.domain(segmentId.length > 0, "segmentId");
    H.domain(sensorId.length > 0, "sensorId");
    H.domain(suppliedFrame.length > 0, "suppliedFrame");
    return { token: JSON.stringify([segmentId, sensorId, suppliedFrame]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    segmentId: "S17",
    sensorId: "IMU4",
    suppliedFrame: "x forward, z up",
  },
  output: { token: '["S17","IMU4","x forward, z up"]' },
} satisfies ToolExample<Input, Output>;
export const segmentInertialUnitOrientationTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomechanics", "engineering"],
      keywords: ["biomechanics", "engineering"],
    },
    id: "biomechanics/segment-inertial-unit-orientation-tag",
    title: "Segment Inertial Unit Orientation Tag",
    description:
      "Record explicit segment inertial-sensor frame metadata without rotating measurements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentId: { type: "string", maxLength: 8192, minLength: 1 },
        sensorId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedFrame: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["segmentId", "sensorId", "suppliedFrame"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "segmentId",
          label: "Segment Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sensorId",
          label: "Sensor Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedFrame",
          label: "Supplied Frame",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = segmentInertialUnitOrientationTagTool.execute;
export default segmentInertialUnitOrientationTagTool;
