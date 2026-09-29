import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly markerHeight: number;
  readonly recessDepth: number;
  readonly desiredProtrusion: number;
};
export type Output = { readonly protrusion: number; readonly margin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    markerHeight: { type: "number", minimum: 0 },
    recessDepth: { type: "number", minimum: 0 },
    desiredProtrusion: { type: "number", minimum: 0 },
  },
  required: ["markerHeight", "recessDepth", "desiredProtrusion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { protrusion: { type: "number" }, margin: { type: "number" } },
  required: ["protrusion", "margin"],
} as const;
/** Calculate tactile marker height clearance margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { markerHeight, recessDepth, desiredProtrusion } = request;
  const compute = (): Output => {
    H.domain(markerHeight >= 0 && recessDepth >= 0 && desiredProtrusion >= 0);
    return {
      protrusion: markerHeight - recessDepth,
      margin: markerHeight - recessDepth - desiredProtrusion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { markerHeight: 3, recessDepth: 1, desiredProtrusion: 1.5 },
  output: { protrusion: 2, margin: 0.5 },
} satisfies ToolExample<Input, Output>;
export const tactileMarkerHeightClearanceMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/tactile-marker-height-clearance-margin",
    title: "Tactile Marker Height Clearance Margin Tool",
    description:
      "Calculate tactile marker height clearance margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        markerHeight: { type: "number", minimum: 0 },
        recessDepth: { type: "number", minimum: 0 },
        desiredProtrusion: { type: "number", minimum: 0 },
      },
      required: ["markerHeight", "recessDepth", "desiredProtrusion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        protrusion: { type: "number" },
        margin: { type: "number" },
      },
      required: ["protrusion", "margin"],
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
          id: "recessDepth",
          label: "Recess Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "desiredProtrusion",
          label: "Desired Protrusion",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "protrusion",
          label: "Protrusion",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tactileMarkerHeightClearanceMarginTool.execute;
export default tactileMarkerHeightClearanceMarginTool;
