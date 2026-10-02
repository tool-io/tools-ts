import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredResponse: number;
  readonly referenceResponse: number;
  readonly blankResponse: number;
};
export type Output = { readonly corrected: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredResponse: { type: "number" },
    referenceResponse: { type: "number" },
    blankResponse: { type: "number" },
  },
  required: ["measuredResponse", "referenceResponse", "blankResponse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { corrected: { type: "number" }, residual: { type: "number" } },
  required: ["corrected", "residual"],
} as const;
/** Calculate chromatographic marker response gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredResponse, referenceResponse, blankResponse } = request;
  const compute = (): Output => {
    return {
      corrected: measuredResponse - blankResponse,
      residual: measuredResponse - blankResponse - referenceResponse,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredResponse: 12, referenceResponse: 8, blankResponse: 2 },
  output: { corrected: 10, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const chromatographicMarkerResponseGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/chromatographic-marker-response-gap",
    title: "Chromatographic Marker Response Gap Tool",
    description:
      "Calculate chromatographic marker response gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredResponse: { type: "number" },
        referenceResponse: { type: "number" },
        blankResponse: { type: "number" },
      },
      required: ["measuredResponse", "referenceResponse", "blankResponse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        corrected: { type: "number" },
        residual: { type: "number" },
      },
      required: ["corrected", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "measuredResponse",
          label: "Measured Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceResponse",
          label: "Reference Response",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankResponse",
          label: "Blank Response",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = chromatographicMarkerResponseGapTool.execute;
export default chromatographicMarkerResponseGapTool;
