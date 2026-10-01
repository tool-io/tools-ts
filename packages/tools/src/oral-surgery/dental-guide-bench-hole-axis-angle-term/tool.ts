import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axis: readonly number[];
  readonly guideNormal: readonly number[];
};
export type Output = {
  readonly angleRadians: number;
  readonly acuteAngleRadians: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axis: { type: "array", maxItems: 256, items: { type: "number" } },
    guideNormal: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["axis", "guideNormal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angleRadians: { type: "number" },
    acuteAngleRadians: { type: "number" },
  },
  required: ["angleRadians", "acuteAngleRadians"],
} as const;
/** Compare oriented versus unoriented bench axis/normal angles. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axis, guideNormal } = request;
  const compute = (): Output => {
    H.domain(
      axis.length === 3 &&
        guideNormal.length === 3 &&
        Math.hypot(...axis) > 0 &&
        Math.hypot(...guideNormal) > 0,
    );
    return {
      angleRadians: Math.acos(
        Math.max(
          -1,
          Math.min(
            1,
            H.dot(axis, guideNormal) /
              (Math.hypot(...axis) * Math.hypot(...guideNormal)),
          ),
        ),
      ),
      acuteAngleRadians: Math.acos(
        Math.min(
          1,
          Math.abs(
            H.dot(axis, guideNormal) /
              (Math.hypot(...axis) * Math.hypot(...guideNormal)),
          ),
        ),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axis: [0, 0, 2], guideNormal: [0, 0, -1] },
  output: { angleRadians: 3.141592653589793, acuteAngleRadians: 0 },
} satisfies ToolExample<Input, Output>;
export const dentalGuideBenchHoleAxisAngleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/dental-guide-bench-hole-axis-angle-term",
    title: "Dental Guide Bench Hole Axis Angle Term Tool",
    description: "Compare oriented versus unoriented bench axis/normal angles.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axis: { type: "array", maxItems: 256, items: { type: "number" } },
        guideNormal: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["axis", "guideNormal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angleRadians: { type: "number" },
        acuteAngleRadians: { type: "number" },
      },
      required: ["angleRadians", "acuteAngleRadians"],
    },
    ports: {
      inputs: [
        {
          id: "axis",
          label: "Axis",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "guideNormal",
          label: "Guide Normal",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "angleRadians",
          label: "Angle Radians",
          valueType: { type: "number" },
        },
        {
          id: "acuteAngleRadians",
          label: "Acute Angle Radians",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dentalGuideBenchHoleAxisAngleTermTool.execute;
export default dentalGuideBenchHoleAxisAngleTermTool;
