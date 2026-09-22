import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly edgeForce: number;
  readonly edgeLength: number;
  readonly referenceDensity: number;
};
export type Output = {
  readonly forcePerLength: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    edgeForce: { type: "number", minimum: 0 },
    edgeLength: { type: "number", exclusiveMinimum: 0 },
    referenceDensity: { type: "number", minimum: 0 },
  },
  required: ["edgeForce", "edgeLength", "referenceDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forcePerLength: { type: "number" },
    margin: { type: "number" },
  },
  required: ["forcePerLength", "margin"],
} as const;
/** Measured edge-force density only; the explicit reference is not a conservation safety threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { edgeForce, edgeLength, referenceDensity } = request;
  const compute = (): Output => {
    H.domain(edgeForce >= 0 && referenceDensity >= 0);
    H.positive(edgeLength);
    return {
      forcePerLength: edgeForce / edgeLength,
      margin: edgeForce / edgeLength - referenceDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { edgeForce: 100, edgeLength: 2, referenceDensity: 40 },
  output: { forcePerLength: 50, margin: 10 },
} satisfies ToolExample<Input, Output>;
export const canvasTensionEdgeForceDensityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/canvas-tension-edge-force-density",
    title: "Canvas Tension Edge Force Density Tool",
    description:
      "Measured edge-force density only; the explicit reference is not a conservation safety threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        edgeForce: { type: "number", minimum: 0 },
        edgeLength: { type: "number", exclusiveMinimum: 0 },
        referenceDensity: { type: "number", minimum: 0 },
      },
      required: ["edgeForce", "edgeLength", "referenceDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forcePerLength: { type: "number" },
        margin: { type: "number" },
      },
      required: ["forcePerLength", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "edgeForce",
          label: "Edge Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edgeLength",
          label: "Edge Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDensity",
          label: "Reference Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "forcePerLength",
          label: "Force Per Length",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = canvasTensionEdgeForceDensityTool.execute;
export default canvasTensionEdgeForceDensityTool;
