import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly centerDistance: number;
  readonly canopyRadius: number;
  readonly requiredSetback: number;
};
export type Output = {
  readonly canopyEdgeDistance: number;
  readonly margin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerDistance: { type: "number", minimum: 0 },
    canopyRadius: { type: "number", minimum: 0 },
    requiredSetback: { type: "number", minimum: 0 },
  },
  required: ["centerDistance", "canopyRadius", "requiredSetback"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    canopyEdgeDistance: { type: "number" },
    margin: { type: "number" },
  },
  required: ["canopyEdgeDistance", "margin"],
} as const;
/** Calculate canopy projection setback gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { centerDistance, canopyRadius, requiredSetback } = request;
  const compute = (): Output => {
    H.domain(centerDistance >= 0 && canopyRadius >= 0 && requiredSetback >= 0);
    return {
      canopyEdgeDistance: centerDistance - canopyRadius,
      margin: centerDistance - canopyRadius - requiredSetback,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { centerDistance: 8, canopyRadius: 3, requiredSetback: 2 },
  output: { canopyEdgeDistance: 5, margin: 3 },
} satisfies ToolExample<Input, Output>;
export const canopyProjectionSetbackGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/canopy-projection-setback-gap",
    title: "Canopy Projection Setback Gap Tool",
    description:
      "Calculate canopy projection setback gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerDistance: { type: "number", minimum: 0 },
        canopyRadius: { type: "number", minimum: 0 },
        requiredSetback: { type: "number", minimum: 0 },
      },
      required: ["centerDistance", "canopyRadius", "requiredSetback"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        canopyEdgeDistance: { type: "number" },
        margin: { type: "number" },
      },
      required: ["canopyEdgeDistance", "margin"],
    },
    ports: {
      inputs: [
        {
          id: "centerDistance",
          label: "Center Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "canopyRadius",
          label: "Canopy Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredSetback",
          label: "Required Setback",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "canopyEdgeDistance",
          label: "Canopy Edge Distance",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = canopyProjectionSetbackGapTool.execute;
export default canopyProjectionSetbackGapTool;
