import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly innerRadius: number;
  readonly width: number;
  readonly sweepRadians: number;
};
export type Output = {
  readonly innerLength: number;
  readonly outerLength: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innerRadius: { type: "number", minimum: 0 },
    width: { type: "number", minimum: 0 },
    sweepRadians: { type: "number", minimum: 0 },
  },
  required: ["innerRadius", "width", "sweepRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    innerLength: { type: "number" },
    outerLength: { type: "number" },
    difference: { type: "number" },
  },
  required: ["innerLength", "outerLength", "difference"],
} as const;
/** Calculate path curve inner outer length gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { innerRadius, width, sweepRadians } = request;
  const compute = (): Output => {
    H.domain(innerRadius >= 0 && width >= 0 && sweepRadians >= 0);
    return {
      innerLength: innerRadius * sweepRadians,
      outerLength: (innerRadius + width) * sweepRadians,
      difference: width * sweepRadians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { innerRadius: 5, width: 2, sweepRadians: 3 },
  output: { innerLength: 15, outerLength: 21, difference: 6 },
} satisfies ToolExample<Input, Output>;
export const pathCurveInnerOuterLengthGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/path-curve-inner-outer-length-gap",
    title: "Path Curve Inner Outer Length Gap Tool",
    description:
      "Calculate path curve inner outer length gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innerRadius: { type: "number", minimum: 0 },
        width: { type: "number", minimum: 0 },
        sweepRadians: { type: "number", minimum: 0 },
      },
      required: ["innerRadius", "width", "sweepRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        innerLength: { type: "number" },
        outerLength: { type: "number" },
        difference: { type: "number" },
      },
      required: ["innerLength", "outerLength", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "innerRadius",
          label: "Inner Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sweepRadians",
          label: "Sweep Radians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "innerLength",
          label: "Inner Length",
          valueType: { type: "number" },
        },
        {
          id: "outerLength",
          label: "Outer Length",
          valueType: { type: "number" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pathCurveInnerOuterLengthGapTool.execute;
export default pathCurveInnerOuterLengthGapTool;
