import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vesselHeight: number;
  readonly measuredLevel: number;
  readonly sensorOffset: number;
};
export type Output = {
  readonly correctedLevel: number;
  readonly headspace: number;
  readonly outsideGeometry: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vesselHeight: { type: "number", minimum: 0 },
    measuredLevel: { type: "number" },
    sensorOffset: { type: "number" },
  },
  required: ["vesselHeight", "measuredLevel", "sensorOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedLevel: { type: "number" },
    headspace: { type: "number" },
    outsideGeometry: { type: "boolean" },
  },
  required: ["correctedLevel", "headspace", "outsideGeometry"],
} as const;
/** Supplied vertical level geometry; negative headspace remains visible instead of being silently clipped. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vesselHeight, measuredLevel, sensorOffset } = request;
  const compute = (): Output => {
    H.domain(vesselHeight >= 0);
    return {
      correctedLevel: measuredLevel - sensorOffset,
      headspace: vesselHeight - measuredLevel + sensorOffset,
      outsideGeometry:
        measuredLevel - sensorOffset < 0 ||
        measuredLevel - sensorOffset > vesselHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vesselHeight: 100, measuredLevel: 70, sensorOffset: 5 },
  output: { correctedLevel: 65, headspace: 35, outsideGeometry: false },
} satisfies ToolExample<Input, Output>;
export const cryogenLevelEmptyHeadspaceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/cryogen-level-empty-headspace",
    title: "Cryogen Level Empty Headspace Tool",
    description:
      "Supplied vertical level geometry; negative headspace remains visible instead of being silently clipped.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vesselHeight: { type: "number", minimum: 0 },
        measuredLevel: { type: "number" },
        sensorOffset: { type: "number" },
      },
      required: ["vesselHeight", "measuredLevel", "sensorOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedLevel: { type: "number" },
        headspace: { type: "number" },
        outsideGeometry: { type: "boolean" },
      },
      required: ["correctedLevel", "headspace", "outsideGeometry"],
    },
    ports: {
      inputs: [
        {
          id: "vesselHeight",
          label: "Vessel Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredLevel",
          label: "Measured Level",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sensorOffset",
          label: "Sensor Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedLevel",
          label: "Corrected Level",
          valueType: { type: "number" },
        },
        { id: "headspace", label: "Headspace", valueType: { type: "number" } },
        {
          id: "outsideGeometry",
          label: "Outside Geometry",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = cryogenLevelEmptyHeadspaceTool.execute;
export default cryogenLevelEmptyHeadspaceTool;
