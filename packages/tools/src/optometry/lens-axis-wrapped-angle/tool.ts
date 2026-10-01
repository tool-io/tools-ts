import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axisDegrees: number;
  readonly originDegrees: number;
};
export type Output = { readonly wrappedDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisDegrees: { type: "number" },
    originDegrees: { type: "number" },
  },
  required: ["axisDegrees", "originDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { wrappedDegrees: { type: "number" } },
  required: ["wrappedDegrees"],
} as const;
/** Wrap an explicitly supplied unoriented research axis to a half-turn coordinate; no prescription is generated. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axisDegrees, originDegrees } = request;
  const compute = (): Output => {
    const positiveRemainder = (x: number, n: number): number => {
      const r = x % n;
      if (r >= 0) return r;
      const v = r + n;
      return v === n ? 0 : v;
    };
    const wrappedDifference = (a: number, b: number, n: number): number => {
      const d = a - b;
      return Number.isFinite(d)
        ? positiveRemainder(d, n)
        : positiveRemainder(
            positiveRemainder(a, n) - positiveRemainder(b, n),
            n,
          );
    };
    return {
      wrappedDegrees: wrappedDifference(axisDegrees, originDegrees, 180),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axisDegrees: 190, originDegrees: 0 },
  output: { wrappedDegrees: 10 },
} satisfies ToolExample<Input, Output>;
export const lensAxisWrappedAngleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/lens-axis-wrapped-angle",
    title: "Lens Axis Wrapped Angle Tool",
    description:
      "Wrap an explicitly supplied unoriented research axis to a half-turn coordinate; no prescription is generated.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisDegrees: { type: "number" },
        originDegrees: { type: "number" },
      },
      required: ["axisDegrees", "originDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { wrappedDegrees: { type: "number" } },
      required: ["wrappedDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "axisDegrees",
          label: "Axis Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "originDegrees",
          label: "Origin Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "wrappedDegrees",
          label: "Wrapped Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lensAxisWrappedAngleTool.execute;
export default lensAxisWrappedAngleTool;
