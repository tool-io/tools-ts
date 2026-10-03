import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly multiplier: number;
  readonly offset: number;
  readonly value: number;
};
export type Output = { readonly fixedPoint: number; readonly centered: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multiplier: { type: "number" },
    offset: { type: "number" },
    value: { type: "number" },
  },
  required: ["multiplier", "offset", "value"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fixedPoint: { type: "number" }, centered: { type: "number" } },
  required: ["fixedPoint", "centered"],
} as const;
/** Calculate recurrence affine fixed point shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { multiplier, offset, value } = request;
  const compute = (): Output => {
    H.domain(multiplier !== 1);
    const fixedPoint = offset / (1 - multiplier);
    return { fixedPoint, centered: value - fixedPoint };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { multiplier: 0.5, offset: 2, value: 7 },
  output: { fixedPoint: 4, centered: 3 },
} satisfies ToolExample<Input, Output>;
export const recurrenceAffineFixedPointShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/recurrence-affine-fixed-point-shift",
    title: "Recurrence Affine Fixed Point Shift Tool",
    description:
      "Calculate recurrence affine fixed point shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        multiplier: { type: "number" },
        offset: { type: "number" },
        value: { type: "number" },
      },
      required: ["multiplier", "offset", "value"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fixedPoint: { type: "number" },
        centered: { type: "number" },
      },
      required: ["fixedPoint", "centered"],
    },
    ports: {
      inputs: [
        {
          id: "multiplier",
          label: "Multiplier",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fixedPoint",
          label: "Fixed Point",
          valueType: { type: "number" },
        },
        { id: "centered", label: "Centered", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = recurrenceAffineFixedPointShiftTool.execute;
export default recurrenceAffineFixedPointShiftTool;
