import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly longitudeText: string;
  readonly conventionSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    longitudeText: { type: "string", maxLength: 8192, minLength: 1 },
    conventionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "longitudeText", "conventionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit longitude direction text and source without parsing or normalizing coordinates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, longitudeText, conventionSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(longitudeText.length > 0, "longitudeText");
    H.domain(conventionSource.length > 0, "conventionSource");
    return {
      token: JSON.stringify([recordId, longitudeText, conventionSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", longitudeText: "73 W", conventionSource: "Map A" },
  output: { token: '["R17","73 W","Map A"]' },
} satisfies ToolExample<Input, Output>;
export const longitudeEastWestSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["geography", "earth and environmental sciences"],
      keywords: ["geography", "earth and environmental sciences"],
    },
    id: "geography/longitude-east-west-source-label",
    title: "Longitude East West Source Label",
    description:
      "Preserve explicit longitude direction text and source without parsing or normalizing coordinates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        longitudeText: { type: "string", maxLength: 8192, minLength: 1 },
        conventionSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "longitudeText", "conventionSource"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "longitudeText",
          label: "Longitude Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "conventionSource",
          label: "Convention Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = longitudeEastWestSourceLabelTool.execute;
export default longitudeEastWestSourceLabelTool;
