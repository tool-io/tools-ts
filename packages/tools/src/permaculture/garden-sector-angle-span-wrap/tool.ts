import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startDegrees: number;
  readonly endDegrees: number;
  readonly clockwise: boolean;
  readonly fullCircleWhenEqual: boolean;
};
export type Output = { readonly spanDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startDegrees: { type: "number" },
    endDegrees: { type: "number" },
    clockwise: { type: "boolean" },
    fullCircleWhenEqual: { type: "boolean" },
  },
  required: ["startDegrees", "endDegrees", "clockwise", "fullCircleWhenEqual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spanDegrees: { type: "number" } },
  required: ["spanDegrees"],
} as const;
/** Measure an explicitly directed modular sector span and equal-endpoint policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startDegrees, endDegrees, clockwise, fullCircleWhenEqual } = request;
  const compute = (): Output => {
    const norm = (x: number) => {
      const r = x % 360;
      return r < 0 ? r + 360 : r;
    };
    const a = norm(startDegrees),
      b = norm(endDegrees),
      raw = clockwise ? b - a : a - b;
    return {
      spanDegrees:
        raw === 0 ? (fullCircleWhenEqual ? 360 : 0) : raw < 0 ? raw + 360 : raw,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startDegrees: 350,
    endDegrees: 10,
    clockwise: true,
    fullCircleWhenEqual: false,
  },
  output: { spanDegrees: 20 },
} satisfies ToolExample<Input, Output>;
export const gardenSectorAngleSpanWrapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/garden-sector-angle-span-wrap",
    title: "Garden Sector Angle Span Wrap Tool",
    description:
      "Measure an explicitly directed modular sector span and equal-endpoint policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startDegrees: { type: "number" },
        endDegrees: { type: "number" },
        clockwise: { type: "boolean" },
        fullCircleWhenEqual: { type: "boolean" },
      },
      required: [
        "startDegrees",
        "endDegrees",
        "clockwise",
        "fullCircleWhenEqual",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { spanDegrees: { type: "number" } },
      required: ["spanDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "startDegrees",
          label: "Start Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endDegrees",
          label: "End Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clockwise",
          label: "Clockwise",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "fullCircleWhenEqual",
          label: "Full Circle When Equal",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "spanDegrees",
          label: "Span Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gardenSectorAngleSpanWrapTool.execute;
export default gardenSectorAngleSpanWrapTool;
