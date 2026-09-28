import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bleedRadius: number;
  readonly trimRadius: number;
  readonly placementTolerance: number;
};
export type Output = {
  readonly radialGap: number;
  readonly worstMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bleedRadius: { type: "number", minimum: 0 },
    trimRadius: { type: "number", minimum: 0 },
    placementTolerance: { type: "number", minimum: 0 },
  },
  required: ["bleedRadius", "trimRadius", "placementTolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radialGap: { type: "number" },
    worstMargin: { type: "number" },
  },
  required: ["radialGap", "worstMargin"],
} as const;
/** Calculate bleed corner trim radius gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bleedRadius, trimRadius, placementTolerance } = request;
  const compute = (): Output => {
    H.domain(bleedRadius >= 0 && trimRadius >= 0 && placementTolerance >= 0);
    return {
      radialGap: bleedRadius - trimRadius,
      worstMargin: bleedRadius - trimRadius - placementTolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bleedRadius: 8, trimRadius: 5, placementTolerance: 1 },
  output: { radialGap: 3, worstMargin: 2 },
} satisfies ToolExample<Input, Output>;
export const bleedCornerTrimRadiusGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/bleed-corner-trim-radius-gap",
    title: "Bleed Corner Trim Radius Gap Tool",
    description:
      "Calculate bleed corner trim radius gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bleedRadius: { type: "number", minimum: 0 },
        trimRadius: { type: "number", minimum: 0 },
        placementTolerance: { type: "number", minimum: 0 },
      },
      required: ["bleedRadius", "trimRadius", "placementTolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radialGap: { type: "number" },
        worstMargin: { type: "number" },
      },
      required: ["radialGap", "worstMargin"],
    },
    ports: {
      inputs: [
        {
          id: "bleedRadius",
          label: "Bleed Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trimRadius",
          label: "Trim Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "placementTolerance",
          label: "Placement Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "radialGap", label: "Radial Gap", valueType: { type: "number" } },
        {
          id: "worstMargin",
          label: "Worst Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bleedCornerTrimRadiusGapTool.execute;
export default bleedCornerTrimRadiusGapTool;
