import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axisLabels: readonly string[];
  readonly requestedLabel: string;
};
export type Output = {
  readonly matchingIndices: readonly number[];
  readonly ambiguous: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedLabel: { type: "string", maxLength: 8192 },
  },
  required: ["axisLabels", "requestedLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchingIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    ambiguous: { type: "boolean" },
  },
  required: ["matchingIndices", "ambiguous"],
} as const;
/** Locate exact caller-supplied image-axis labels without assigning anatomy from pixel orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axisLabels, requestedLabel } = request;
  const compute = (): Output => {
    const matchingIndices = axisLabels.flatMap((x, i) =>
      x === requestedLabel ? [i] : [],
    );
    return { matchingIndices, ambiguous: matchingIndices.length > 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axisLabels: ["L", "R", "L"], requestedLabel: "L" },
  output: { matchingIndices: [0, 2], ambiguous: true },
} satisfies ToolExample<Input, Output>;
export const kidneyImageAxisLabelTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/kidney-image-axis-label-token",
    title: "Kidney Image Axis Label Token Tool",
    description:
      "Locate exact caller-supplied image-axis labels without assigning anatomy from pixel orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedLabel: { type: "string", maxLength: 8192 },
      },
      required: ["axisLabels", "requestedLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchingIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        ambiguous: { type: "boolean" },
      },
      required: ["matchingIndices", "ambiguous"],
    },
    ports: {
      inputs: [
        {
          id: "axisLabels",
          label: "Axis Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedLabel",
          label: "Requested Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "matchingIndices",
          label: "Matching Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "ambiguous", label: "Ambiguous", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = kidneyImageAxisLabelTokenTool.execute;
export default kidneyImageAxisLabelTokenTool;
