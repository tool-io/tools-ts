import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seamAllowance: number;
  readonly interiorAngleRadians: number;
};
export type Output = { readonly bisectorOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seamAllowance: { type: "number", minimum: 0 },
    interiorAngleRadians: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["seamAllowance", "interiorAngleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { bisectorOffset: { type: "number" } },
  required: ["bisectorOffset"],
} as const;
/** Calculate the outward miter distance along a convex corner bisector for explicit equal seam allowances without choosing a sewing allowance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seamAllowance, interiorAngleRadians } = request;
  const compute = (): Output => {
    H.domain(seamAllowance >= 0, "seamAllowance");
    H.domain(
      interiorAngleRadians > 0 && interiorAngleRadians < Math.PI,
      "interiorAngleRadians",
    );
    return {
      bisectorOffset: seamAllowance / Math.sin(interiorAngleRadians / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { seamAllowance: 1, interiorAngleRadians: 1.5707963267948966 },
  output: { bisectorOffset: 1.4142135623730951 },
} satisfies ToolExample<Input, Output>;
export const seamlineCutlineCornerBisectorOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["fashion", "arts and design"],
        keywords: ["fashion", "arts and design"],
      },
      id: "fashion/seamline-cutline-corner-bisector-offset",
      title: "Seamline Cutline Corner Bisector Offset",
      description:
        "Calculate the outward miter distance along a convex corner bisector for explicit equal seam allowances without choosing a sewing allowance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          seamAllowance: { type: "number", minimum: 0 },
          interiorAngleRadians: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["seamAllowance", "interiorAngleRadians"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { bisectorOffset: { type: "number" } },
        required: ["bisectorOffset"],
      },
      ports: {
        inputs: [
          {
            id: "seamAllowance",
            label: "Seam Allowance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interiorAngleRadians",
            label: "Interior Angle Radians",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "bisectorOffset",
            label: "Bisector Offset",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = seamlineCutlineCornerBisectorOffsetTool.execute;
export default seamlineCutlineCornerBisectorOffsetTool;
