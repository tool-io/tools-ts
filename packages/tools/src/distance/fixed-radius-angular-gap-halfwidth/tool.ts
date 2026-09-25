import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly radius: number;
  readonly angle: number;
  readonly angularHalfwidth: number;
};
export type Output = {
  readonly minimumArc: number;
  readonly maximumArc: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number" },
    angle: { type: "number" },
    angularHalfwidth: { type: "number" },
  },
  required: ["radius", "angle", "angularHalfwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumArc: { type: "number" },
    maximumArc: { type: "number" },
  },
  required: ["minimumArc", "maximumArc"],
} as const;
/** Compute fixed radius angular gap halfwidth from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { radius, angle, angularHalfwidth } = input;
  const compute = (): Output => {
    domain(radius >= 0 && angle >= 0 && angularHalfwidth >= 0);
    return {
      minimumArc: radius * Math.max(0, angle - angularHalfwidth),
      maximumArc: radius * (angle + angularHalfwidth),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { radius: 2, angle: 1, angularHalfwidth: 0.25 },
  output: { minimumArc: 1.5, maximumArc: 2.5 },
} satisfies ToolExample<Input, Output>;
export const fixedRadiusAngularGapHalfwidthTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "distance/fixed-radius-angular-gap-halfwidth",
  title: "Fixed Radius Angular Gap Halfwidth Tool",
  description:
    "Compute fixed radius angular gap halfwidth from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "radius",
        label: "Radius",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "angle",
        label: "Angle",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "angularHalfwidth",
        label: "Angular Halfwidth",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "minimumArc", label: "Minimum Arc", valueType: { type: "number" } },
      { id: "maximumArc", label: "Maximum Arc", valueType: { type: "number" } },
    ],
  },
});
export const run = fixedRadiusAngularGapHalfwidthTool.execute;
export default fixedRadiusAngularGapHalfwidthTool;
