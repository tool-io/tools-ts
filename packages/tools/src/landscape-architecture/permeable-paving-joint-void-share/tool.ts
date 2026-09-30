import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly paverWidth: number;
  readonly paverLength: number;
  readonly joint: number;
};
export type Output = {
  readonly jointFraction: number;
  readonly paverFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    paverWidth: { type: "number", exclusiveMinimum: 0 },
    paverLength: { type: "number", exclusiveMinimum: 0 },
    joint: { type: "number", minimum: 0 },
  },
  required: ["paverWidth", "paverLength", "joint"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointFraction: { type: "number" },
    paverFraction: { type: "number" },
  },
  required: ["jointFraction", "paverFraction"],
} as const;
/** Rectangular repeating module; joint fraction describes plan area, not hydraulic infiltration capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { paverWidth, paverLength, joint } = request;
  const compute = (): Output => {
    H.positive(paverWidth);
    H.positive(paverLength);
    H.domain(joint >= 0);
    return {
      jointFraction:
        1 -
        (paverWidth * paverLength) /
          ((paverWidth + joint) * (paverLength + joint)),
      paverFraction:
        (paverWidth * paverLength) /
        ((paverWidth + joint) * (paverLength + joint)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { paverWidth: 9, paverLength: 9, joint: 1 },
  output: { jointFraction: 0.18999999999999995, paverFraction: 0.81 },
} satisfies ToolExample<Input, Output>;
export const permeablePavingJointVoidShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/permeable-paving-joint-void-share",
    title: "Permeable Paving Joint Void Share Tool",
    description:
      "Rectangular repeating module; joint fraction describes plan area, not hydraulic infiltration capacity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        paverWidth: { type: "number", exclusiveMinimum: 0 },
        paverLength: { type: "number", exclusiveMinimum: 0 },
        joint: { type: "number", minimum: 0 },
      },
      required: ["paverWidth", "paverLength", "joint"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        jointFraction: { type: "number" },
        paverFraction: { type: "number" },
      },
      required: ["jointFraction", "paverFraction"],
    },
    ports: {
      inputs: [
        {
          id: "paverWidth",
          label: "Paver Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paverLength",
          label: "Paver Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "joint",
          label: "Joint",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "jointFraction",
          label: "Joint Fraction",
          valueType: { type: "number" },
        },
        {
          id: "paverFraction",
          label: "Paver Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = permeablePavingJointVoidShareTool.execute;
export default permeablePavingJointVoidShareTool;
