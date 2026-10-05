import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly equalLegChamferWidth: number };
export type Output = { readonly chamferFaceLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equalLegChamferWidth: { type: "number", minimum: 0 } },
  required: ["equalLegChamferWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { chamferFaceLength: { type: "number" } },
  required: ["chamferFaceLength"],
} as const;
/** Convert an equal-leg 45-degree chamfer setback to its diagonal face length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { equalLegChamferWidth } = request;
  const compute = (): Output => {
    H.domain(equalLegChamferWidth >= 0, "equalLegChamferWidth");
    return { chamferFaceLength: Math.SQRT2 * equalLegChamferWidth };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { equalLegChamferWidth: 3 },
  output: { chamferFaceLength: 4.242640687119286 },
} satisfies ToolExample<Input, Output>;
export const chamferWidthFaceLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/chamfer-width-face-length",
    title: "Chamfer Width Face Length Tool",
    description:
      "Convert an equal-leg 45-degree chamfer setback to its diagonal face length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equalLegChamferWidth: { type: "number", minimum: 0 } },
      required: ["equalLegChamferWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { chamferFaceLength: { type: "number" } },
      required: ["chamferFaceLength"],
    },
    ports: {
      inputs: [
        {
          id: "equalLegChamferWidth",
          label: "Equal Leg Chamfer Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "chamferFaceLength",
          label: "Chamfer Face Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = chamferWidthFaceLengthTool.execute;
export default chamferWidthFaceLengthTool;
