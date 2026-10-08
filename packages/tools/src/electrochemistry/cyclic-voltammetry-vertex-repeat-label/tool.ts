import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scanId: string;
  readonly vertexText: string;
  readonly repeatIdentifier: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scanId: { type: "string", maxLength: 8192, minLength: 1 },
    vertexText: { type: "string", maxLength: 8192, minLength: 1 },
    repeatIdentifier: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["scanId", "vertexText", "repeatIdentifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit cyclic-voltammetry vertex transcription and repeat identifier without predicting electrochemical stability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scanId, vertexText, repeatIdentifier } = request;
  const compute = (): Output => {
    H.domain(scanId.length > 0, "scanId");
    H.domain(vertexText.length > 0, "vertexText");
    H.domain(repeatIdentifier.length > 0, "repeatIdentifier");
    return { token: JSON.stringify([scanId, vertexText, repeatIdentifier]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scanId: "S17", vertexText: "0.8 V", repeatIdentifier: "cycle 2" },
  output: { token: '["S17","0.8 V","cycle 2"]' },
} satisfies ToolExample<Input, Output>;
export const cyclicVoltammetryVertexRepeatLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/cyclic-voltammetry-vertex-repeat-label",
    title: "Cyclic Voltammetry Vertex Repeat Label Tool",
    description:
      "Record an explicit cyclic-voltammetry vertex transcription and repeat identifier without predicting electrochemical stability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scanId: { type: "string", maxLength: 8192, minLength: 1 },
        vertexText: { type: "string", maxLength: 8192, minLength: 1 },
        repeatIdentifier: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["scanId", "vertexText", "repeatIdentifier"],
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
          id: "scanId",
          label: "Scan Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "vertexText",
          label: "Vertex Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "repeatIdentifier",
          label: "Repeat Identifier",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = cyclicVoltammetryVertexRepeatLabelTool.execute;
export default cyclicVoltammetryVertexRepeatLabelTool;
