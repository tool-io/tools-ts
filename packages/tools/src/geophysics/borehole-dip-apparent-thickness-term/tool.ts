import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly apparentThickness: number;
  readonly angleFromBedNormalRadians: number;
};
export type Output = { readonly normalThickness: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    apparentThickness: { type: "number", minimum: 0 },
    angleFromBedNormalRadians: { type: "number" },
  },
  required: ["apparentThickness", "angleFromBedNormalRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { normalThickness: { type: "number" } },
  required: ["normalThickness"],
} as const;
/** Project supplied along-hole apparent thickness onto a bed normal using the explicit angle between borehole and normal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { apparentThickness, angleFromBedNormalRadians } = request;
  const compute = (): Output => {
    H.domain(apparentThickness >= 0, "apparentThickness");
    return {
      normalThickness:
        apparentThickness * Math.abs(Math.cos(angleFromBedNormalRadians)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    apparentThickness: 10,
    angleFromBedNormalRadians: 1.0471975511965976,
  },
  output: { normalThickness: 5.000000000000001 },
} satisfies ToolExample<Input, Output>;
export const boreholeDipApparentThicknessTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/borehole-dip-apparent-thickness-term",
    title: "Borehole Dip Apparent Thickness Term Tool",
    description:
      "Project supplied along-hole apparent thickness onto a bed normal using the explicit angle between borehole and normal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        apparentThickness: { type: "number", minimum: 0 },
        angleFromBedNormalRadians: { type: "number" },
      },
      required: ["apparentThickness", "angleFromBedNormalRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { normalThickness: { type: "number" } },
      required: ["normalThickness"],
    },
    ports: {
      inputs: [
        {
          id: "apparentThickness",
          label: "Apparent Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "angleFromBedNormalRadians",
          label: "Angle From Bed Normal Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalThickness",
          label: "Normal Thickness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boreholeDipApparentThicknessTermTool.execute;
export default boreholeDipApparentThicknessTermTool;
