import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sensorReading: number;
  readonly sensorDatum: number;
  readonly tankBottom: number;
  readonly referenceOffset: number;
};
export type Output = {
  readonly waterElevation: number;
  readonly depth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sensorReading: { type: "number" },
    sensorDatum: { type: "number" },
    tankBottom: { type: "number" },
    referenceOffset: { type: "number" },
  },
  required: ["sensorReading", "sensorDatum", "tankBottom", "referenceOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { waterElevation: { type: "number" }, depth: { type: "number" } },
  required: ["waterElevation", "depth"],
} as const;
/** Translate a supplied level reading to a common datum, preserving a signed bottom-reference gap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sensorReading, sensorDatum, tankBottom, referenceOffset } = request;
  const compute = (): Output => {
    return {
      waterElevation: sensorReading + sensorDatum + referenceOffset,
      depth: sensorReading + sensorDatum + referenceOffset - tankBottom,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sensorReading: 2,
    sensorDatum: 10,
    tankBottom: 9,
    referenceOffset: 0.1,
  },
  output: { waterElevation: 12.1, depth: 3.0999999999999996 },
} satisfies ToolExample<Input, Output>;
export const tankLevelSensorDatumGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/tank-level-sensor-datum-gap",
    title: "Tank Level Sensor Datum Gap Tool",
    description:
      "Translate a supplied level reading to a common datum, preserving a signed bottom-reference gap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sensorReading: { type: "number" },
        sensorDatum: { type: "number" },
        tankBottom: { type: "number" },
        referenceOffset: { type: "number" },
      },
      required: [
        "sensorReading",
        "sensorDatum",
        "tankBottom",
        "referenceOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterElevation: { type: "number" },
        depth: { type: "number" },
      },
      required: ["waterElevation", "depth"],
    },
    ports: {
      inputs: [
        {
          id: "sensorReading",
          label: "Sensor Reading",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sensorDatum",
          label: "Sensor Datum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tankBottom",
          label: "Tank Bottom",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceOffset",
          label: "Reference Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "waterElevation",
          label: "Water Elevation",
          valueType: { type: "number" },
        },
        { id: "depth", label: "Depth", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tankLevelSensorDatumGapTool.execute;
export default tankLevelSensorDatumGapTool;
