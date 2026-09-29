import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trueThickness: number;
  readonly angleRadians: number;
};
export type Output = {
  readonly apparentThickness: number;
  readonly factor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trueThickness: { type: "number", minimum: 0 },
    angleRadians: { type: "number" },
  },
  required: ["trueThickness", "angleRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    apparentThickness: { type: "number" },
    factor: { type: "number" },
  },
  required: ["apparentThickness", "factor"],
} as const;
/** Ideal planar section apparent thickness with angle measured from the normal viewing direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trueThickness, angleRadians } = request;
  const compute = (): Output => {
    H.domain(
      trueThickness >= 0 &&
        angleRadians > -Math.PI / 2 &&
        angleRadians < Math.PI / 2,
    );
    return {
      apparentThickness: trueThickness / Math.cos(angleRadians),
      factor: 1 / Math.cos(angleRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trueThickness: 4, angleRadians: 1.0471975511965976 },
  output: { apparentThickness: 7.999999999999998, factor: 1.9999999999999996 },
} satisfies ToolExample<Input, Output>;
export const sectionObliquityApparentThicknessFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "histology/section-obliquity-apparent-thickness-factor",
      title: "Section Obliquity Apparent Thickness Factor Tool",
      description:
        "Ideal planar section apparent thickness with angle measured from the normal viewing direction.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          trueThickness: { type: "number", minimum: 0 },
          angleRadians: { type: "number" },
        },
        required: ["trueThickness", "angleRadians"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          apparentThickness: { type: "number" },
          factor: { type: "number" },
        },
        required: ["apparentThickness", "factor"],
      },
      ports: {
        inputs: [
          {
            id: "trueThickness",
            label: "True Thickness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "angleRadians",
            label: "Angle Radians",
            required: true,
            valueType: { type: "number", unit: "rad" },
          },
        ],
        outputs: [
          {
            id: "apparentThickness",
            label: "Apparent Thickness",
            valueType: { type: "number" },
          },
          { id: "factor", label: "Factor", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = sectionObliquityApparentThicknessFactorTool.execute;
export default sectionObliquityApparentThicknessFactorTool;
