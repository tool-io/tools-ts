import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plateThickness: number;
  readonly bevelAngle: number;
};
export type Output = {
  readonly bevelRun: number;
  readonly slopedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plateThickness: { type: "number", minimum: 0 },
    bevelAngle: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["plateThickness", "bevelAngle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bevelRun: { type: "number" },
    slopedLength: { type: "number" },
  },
  required: ["bevelRun", "slopedLength"],
} as const;
/** Angle is measured from the broad plate face. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plateThickness, bevelAngle } = request;
  const compute = (): Output => {
    H.domain(
      plateThickness >= 0 && bevelAngle > 0 && bevelAngle <= Math.PI / 2,
    );
    return {
      bevelRun: plateThickness / Math.tan(bevelAngle),
      slopedLength: plateThickness / Math.sin(bevelAngle),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plateThickness: 2, bevelAngle: 0.7853981633974483 },
  output: { bevelRun: 2.0000000000000004, slopedLength: 2.8284271247461903 },
} satisfies ToolExample<Input, Output>;
export const etchingPlateBevelWidthFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "visual-arts/etching-plate-bevel-width-factor",
    title: "Etching Plate Bevel Width Factor Tool",
    description: "Angle is measured from the broad plate face.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plateThickness: { type: "number", minimum: 0 },
        bevelAngle: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["plateThickness", "bevelAngle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bevelRun: { type: "number" },
        slopedLength: { type: "number" },
      },
      required: ["bevelRun", "slopedLength"],
    },
    ports: {
      inputs: [
        {
          id: "plateThickness",
          label: "Plate Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bevelAngle",
          label: "Bevel Angle",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "bevelRun", label: "Bevel Run", valueType: { type: "number" } },
        {
          id: "slopedLength",
          label: "Sloped Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = etchingPlateBevelWidthFactorTool.execute;
export default etchingPlateBevelWidthFactorTool;
