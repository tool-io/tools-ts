import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly insideBendRadius: number;
  readonly panelThickness: number;
};
export type Output = { readonly radiusThicknessRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    insideBendRadius: { type: "number", minimum: 0 },
    panelThickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["insideBendRadius", "panelThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { radiusThicknessRatio: { type: "number" } },
  required: ["radiusThicknessRatio"],
} as const;
/** Normalize explicit inside bend radius to panel thickness without recommending forming limits or material properties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { insideBendRadius, panelThickness } = request;
  const compute = (): Output => {
    H.domain(insideBendRadius >= 0, "insideBendRadius");
    (H.domain(
      Number.isFinite(panelThickness) && panelThickness > 0,
      "panelThickness",
    ),
      panelThickness);
    return { radiusThicknessRatio: insideBendRadius / panelThickness };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { insideBendRadius: 6, panelThickness: 2 },
  output: { radiusThicknessRatio: 3 },
} satisfies ToolExample<Input, Output>;
export const panelBendRadiusThicknessRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["industrial-design", "industrial design", "arts and design"],
      keywords: ["industrial design", "arts and design"],
    },
    id: "industrial-design/panel-bend-radius-thickness-ratio",
    title: "Panel Bend Radius Thickness Ratio",
    description:
      "Normalize explicit inside bend radius to panel thickness without recommending forming limits or material properties.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        insideBendRadius: { type: "number", minimum: 0 },
        panelThickness: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["insideBendRadius", "panelThickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { radiusThicknessRatio: { type: "number" } },
      required: ["radiusThicknessRatio"],
    },
    ports: {
      inputs: [
        {
          id: "insideBendRadius",
          label: "Inside Bend Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "panelThickness",
          label: "Panel Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "radiusThicknessRatio",
          label: "Radius Thickness Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = panelBendRadiusThicknessRatioTool.execute;
export default panelBendRadiusThicknessRatioTool;
