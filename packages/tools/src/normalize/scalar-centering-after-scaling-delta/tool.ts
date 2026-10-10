import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly center: number;
  readonly scale: number;
};
export type Output = {
  readonly centerThenScale: number;
  readonly scaleThenCenter: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    center: { type: "number" },
    scale: { type: "number" },
  },
  required: ["value", "center", "scale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerThenScale: { type: "number" },
    scaleThenCenter: { type: "number" },
    difference: { type: "number" },
  },
  required: ["centerThenScale", "scaleThenCenter", "difference"],
} as const;
/** Compare explicit center-then-scale and scale-then-center conventions, reporting second minus first. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, center, scale } = request;
  const compute = (): Output => {
    return {
      centerThenScale: (value - center) * scale,
      scaleThenCenter: value * scale - center,
      difference: center * (scale - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 5, center: 2, scale: 3 },
  output: { centerThenScale: 9, scaleThenCenter: 13, difference: 4 },
} satisfies ToolExample<Input, Output>;
export const scalarCenteringAfterScalingDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["normalize", "data normalization", "computer science"],
      keywords: ["data normalization", "computer science"],
    },
    id: "normalize/scalar-centering-after-scaling-delta",
    title: "Scalar Centering After Scaling Delta",
    description:
      "Compare explicit center-then-scale and scale-then-center conventions, reporting second minus first.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        center: { type: "number" },
        scale: { type: "number" },
      },
      required: ["value", "center", "scale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        centerThenScale: { type: "number" },
        scaleThenCenter: { type: "number" },
        difference: { type: "number" },
      },
      required: ["centerThenScale", "scaleThenCenter", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "center",
          label: "Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "centerThenScale",
          label: "Center Then Scale",
          valueType: { type: "number" },
        },
        {
          id: "scaleThenCenter",
          label: "Scale Then Center",
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
export const run = scalarCenteringAfterScalingDeltaTool.execute;
export default scalarCenteringAfterScalingDeltaTool;
