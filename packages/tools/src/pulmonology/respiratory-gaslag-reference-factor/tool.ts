import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredLag: number;
  readonly suppliedTransportLag: number;
  readonly timeScale: number;
};
export type Output = { readonly correctedLag: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredLag: { type: "number" },
    suppliedTransportLag: { type: "number" },
    timeScale: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredLag", "suppliedTransportLag", "timeScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedLag: { type: "number" } },
  required: ["correctedLag"],
} as const;
/** Subtract a supplied bench transport lag and rescale time without estimating patient gas exchange. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredLag, suppliedTransportLag, timeScale } = request;
  const compute = (): Output => {
    H.positive(timeScale);
    return { correctedLag: (measuredLag - suppliedTransportLag) * timeScale };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredLag: 0.5, suppliedTransportLag: 0.1, timeScale: 1000 },
  output: { correctedLag: 400 },
} satisfies ToolExample<Input, Output>;
export const respiratoryGaslagReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/respiratory-gaslag-reference-factor",
    title: "Respiratory Gaslag Reference Factor Tool",
    description:
      "Subtract a supplied bench transport lag and rescale time without estimating patient gas exchange.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredLag: { type: "number" },
        suppliedTransportLag: { type: "number" },
        timeScale: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredLag", "suppliedTransportLag", "timeScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedLag: { type: "number" } },
      required: ["correctedLag"],
    },
    ports: {
      inputs: [
        {
          id: "measuredLag",
          label: "Measured Lag",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTransportLag",
          label: "Supplied Transport Lag",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "timeScale",
          label: "Time Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedLag",
          label: "Corrected Lag",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = respiratoryGaslagReferenceFactorTool.execute;
export default respiratoryGaslagReferenceFactorTool;
