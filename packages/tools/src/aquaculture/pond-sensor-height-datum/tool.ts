import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sensorId: string;
  readonly heightText: string;
  readonly datumCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sensorId: { type: "string", maxLength: 8192, minLength: 1 },
    heightText: { type: "string", maxLength: 8192, minLength: 1 },
    datumCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sensorId", "heightText", "datumCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied pond sensor height transcription and explicit datum identifier. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sensorId, heightText, datumCode } = request;
  const compute = (): Output => {
    H.domain(sensorId.length > 0, "sensorId");
    H.domain(heightText.length > 0, "heightText");
    H.domain(datumCode.length > 0, "datumCode");
    return { token: JSON.stringify([sensorId, heightText, datumCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sensorId: "PS17",
    heightText: "1.25 m",
    datumCode: "local benchmark",
  },
  output: { token: '["PS17","1.25 m","local benchmark"]' },
} satisfies ToolExample<Input, Output>;
export const pondSensorHeightDatumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaculture", "agriculture"],
      keywords: ["aquaculture", "agriculture"],
    },
    id: "aquaculture/pond-sensor-height-datum",
    title: "Pond Sensor Height Datum",
    description:
      "Preserve a supplied pond sensor height transcription and explicit datum identifier.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sensorId: { type: "string", maxLength: 8192, minLength: 1 },
        heightText: { type: "string", maxLength: 8192, minLength: 1 },
        datumCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sensorId", "heightText", "datumCode"],
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
          id: "sensorId",
          label: "Sensor Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "heightText",
          label: "Height Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "datumCode",
          label: "Datum Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pondSensorHeightDatumTool.execute;
export default pondSensorHeightDatumTool;
