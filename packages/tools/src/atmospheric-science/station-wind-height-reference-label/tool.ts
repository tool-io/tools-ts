import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stationId: string;
  readonly heightText: string;
  readonly datumWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stationId: { type: "string", maxLength: 8192, minLength: 1 },
    heightText: { type: "string", maxLength: 8192, minLength: 1 },
    datumWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["stationId", "heightText", "datumWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit station wind-measurement height by supplied datum wording without adjusting wind speed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stationId, heightText, datumWording } = request;
  const compute = (): Output => {
    H.domain(stationId.length > 0, "stationId");
    H.domain(heightText.length > 0, "heightText");
    H.domain(datumWording.length > 0, "datumWording");
    return { token: JSON.stringify([stationId, heightText, datumWording]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stationId: "ST17",
    heightText: "10 m",
    datumWording: "above ground",
  },
  output: { token: '["ST17","10 m","above ground"]' },
} satisfies ToolExample<Input, Output>;
export const stationWindHeightReferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "atmospheric-science",
        "atmospheric science",
        "earth and environmental sciences",
      ],
      keywords: ["atmospheric science", "earth and environmental sciences"],
    },
    id: "atmospheric-science/station-wind-height-reference-label",
    title: "Station Wind Height Reference Label",
    description:
      "Qualify an explicit station wind-measurement height by supplied datum wording without adjusting wind speed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stationId: { type: "string", maxLength: 8192, minLength: 1 },
        heightText: { type: "string", maxLength: 8192, minLength: 1 },
        datumWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["stationId", "heightText", "datumWording"],
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
          id: "stationId",
          label: "Station Id",
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
          id: "datumWording",
          label: "Datum Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = stationWindHeightReferenceLabelTool.execute;
export default stationWindHeightReferenceLabelTool;
