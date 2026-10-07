import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseId: string;
  readonly suppliedBin: string;
  readonly scaleSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedBin: { type: "string", maxLength: 8192, minLength: 1 },
    scaleSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["responseId", "suppliedBin", "scaleSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit signal-detection confidence bin and scale source without deriving sensitivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseId, suppliedBin, scaleSource } = request;
  const compute = (): Output => {
    H.domain(responseId.length > 0, "responseId");
    H.domain(suppliedBin.length > 0, "suppliedBin");
    H.domain(scaleSource.length > 0, "scaleSource");
    return { token: JSON.stringify([responseId, suppliedBin, scaleSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseId: "R17", suppliedBin: "high", scaleSource: "scale S4" },
  output: { token: '["R17","high","scale S4"]' },
} satisfies ToolExample<Input, Output>;
export const signalDetectionConfidenceBinLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cognitive-science", "cognitive science", "psychology"],
      keywords: ["cognitive science", "psychology"],
    },
    id: "cognitive-science/signal-detection-confidence-bin-label",
    title: "Signal Detection Confidence Bin Label",
    description:
      "Record an explicit signal-detection confidence bin and scale source without deriving sensitivity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedBin: { type: "string", maxLength: 8192, minLength: 1 },
        scaleSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["responseId", "suppliedBin", "scaleSource"],
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
          id: "responseId",
          label: "Response Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedBin",
          label: "Supplied Bin",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "scaleSource",
          label: "Scale Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = signalDetectionConfidenceBinLabelTool.execute;
export default signalDetectionConfidenceBinLabelTool;
