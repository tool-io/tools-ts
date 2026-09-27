import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly notchDistance: number;
  readonly segmentLength: number;
  readonly reverseDirection: boolean;
};
export type Output = {
  readonly fraction: number;
  readonly orientedDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    notchDistance: { type: "number", minimum: 0 },
    segmentLength: { type: "number", exclusiveMinimum: 0 },
    reverseDirection: { type: "boolean" },
  },
  required: ["notchDistance", "segmentLength", "reverseDirection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fraction: { type: "number" },
    orientedDistance: { type: "number" },
  },
  required: ["fraction", "orientedDistance"],
} as const;
/** Calculate pattern notch relative position from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { notchDistance, segmentLength, reverseDirection } = request;
  const compute = (): Output => {
    H.positive(segmentLength);
    H.domain(notchDistance >= 0 && notchDistance <= segmentLength);
    return {
      fraction: reverseDirection
        ? 1 - notchDistance / segmentLength
        : notchDistance / segmentLength,
      orientedDistance: reverseDirection
        ? segmentLength - notchDistance
        : notchDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { notchDistance: 3, segmentLength: 10, reverseDirection: false },
  output: { fraction: 0.3, orientedDistance: 3 },
} satisfies ToolExample<Input, Output>;
export const patternNotchRelativePositionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/pattern-notch-relative-position",
    title: "Pattern Notch Relative Position Tool",
    description:
      "Calculate pattern notch relative position from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        notchDistance: { type: "number", minimum: 0 },
        segmentLength: { type: "number", exclusiveMinimum: 0 },
        reverseDirection: { type: "boolean" },
      },
      required: ["notchDistance", "segmentLength", "reverseDirection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        orientedDistance: { type: "number" },
      },
      required: ["fraction", "orientedDistance"],
    },
    ports: {
      inputs: [
        {
          id: "notchDistance",
          label: "Notch Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "segmentLength",
          label: "Segment Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseDirection",
          label: "Reverse Direction",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "orientedDistance",
          label: "Oriented Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = patternNotchRelativePositionTool.execute;
export default patternNotchRelativePositionTool;
