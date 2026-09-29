import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markerHeight: number;
  readonly referenceHeight: number;
  readonly substrateOffset: number;
};
export type Output = {
  readonly relativeHeight: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerHeight: { type: "number" },
    referenceHeight: { type: "number", exclusiveMinimum: 0 },
    substrateOffset: { type: "number" },
  },
  required: ["markerHeight", "referenceHeight", "substrateOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relativeHeight: { type: "number" }, ratio: { type: "number" } },
  required: ["relativeHeight", "ratio"],
} as const;
/** Compare supplied heights from a common substrate reference without selecting an accessibility standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markerHeight, referenceHeight, substrateOffset } = request;
  const compute = (): Output => {
    H.positive(referenceHeight);
    return {
      relativeHeight: markerHeight - substrateOffset,
      ratio: (markerHeight - substrateOffset) / referenceHeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { markerHeight: 2, referenceHeight: 1, substrateOffset: 0.5 },
  output: { relativeHeight: 1.5, ratio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const tactileMarkerReferenceHeightRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/tactile-marker-reference-height-ratio",
    title: "Tactile Marker Reference Height Ratio Tool",
    description:
      "Compare supplied heights from a common substrate reference without selecting an accessibility standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerHeight: { type: "number" },
        referenceHeight: { type: "number", exclusiveMinimum: 0 },
        substrateOffset: { type: "number" },
      },
      required: ["markerHeight", "referenceHeight", "substrateOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeHeight: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["relativeHeight", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "markerHeight",
          label: "Marker Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceHeight",
          label: "Reference Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "substrateOffset",
          label: "Substrate Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeHeight",
          label: "Relative Height",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tactileMarkerReferenceHeightRatioTool.execute;
export default tactileMarkerReferenceHeightRatioTool;
