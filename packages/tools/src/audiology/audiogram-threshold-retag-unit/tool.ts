import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measurementId: string;
  readonly thresholdText: string;
  readonly suppliedUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurementId: { type: "string", maxLength: 8192, minLength: 1 },
    thresholdText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["measurementId", "thresholdText", "suppliedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Attach an explicit threshold unit to an audiogram transcription without converting reference levels or interpreting hearing status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measurementId, thresholdText, suppliedUnit } = request;
  const compute = (): Output => {
    H.domain(measurementId.length > 0, "measurementId");
    H.domain(thresholdText.length > 0, "thresholdText");
    H.domain(suppliedUnit.length > 0, "suppliedUnit");
    return {
      token: JSON.stringify([measurementId, thresholdText, suppliedUnit]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measurementId: "M17", thresholdText: "25", suppliedUnit: "dB HL" },
  output: { token: '["M17","25","dB HL"]' },
} satisfies ToolExample<Input, Output>;
export const audiogramThresholdRetagUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/audiogram-threshold-retag-unit",
    title: "Audiogram Threshold Retag Unit",
    description:
      "Attach an explicit threshold unit to an audiogram transcription without converting reference levels or interpreting hearing status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measurementId: { type: "string", maxLength: 8192, minLength: 1 },
        thresholdText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["measurementId", "thresholdText", "suppliedUnit"],
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
          id: "measurementId",
          label: "Measurement Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "thresholdText",
          label: "Threshold Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedUnit",
          label: "Supplied Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = audiogramThresholdRetagUnitTool.execute;
export default audiogramThresholdRetagUnitTool;
