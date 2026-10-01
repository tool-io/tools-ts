import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axisDegrees: number;
  readonly referenceDegrees: number;
  readonly unoriented: boolean;
};
export type Output = { readonly acuteGapDegrees: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axisDegrees: { type: "number" },
    referenceDegrees: { type: "number" },
    unoriented: { type: "boolean" },
  },
  required: ["axisDegrees", "referenceDegrees", "unoriented"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { acuteGapDegrees: { type: "number" } },
  required: ["acuteGapDegrees"],
} as const;
/** Compare supplied research axes under explicit 180- or 360-degree periodicity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axisDegrees, referenceDegrees, unoriented } = request;
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
      acuteGapDegrees: (() => {
        const p = unoriented ? 180 : 360,
          d = wrappedDifference(axisDegrees, referenceDegrees, p);
        return Math.min(d, p - d);
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axisDegrees: 170, referenceDegrees: 10, unoriented: true },
  output: { acuteGapDegrees: 20 },
} satisfies ToolExample<Input, Output>;
export const toothAxisReferenceAngleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthodontics/tooth-axis-reference-angle",
    title: "Tooth Axis Reference Angle Tool",
    description:
      "Compare supplied research axes under explicit 180- or 360-degree periodicity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axisDegrees: { type: "number" },
        referenceDegrees: { type: "number" },
        unoriented: { type: "boolean" },
      },
      required: ["axisDegrees", "referenceDegrees", "unoriented"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { acuteGapDegrees: { type: "number" } },
      required: ["acuteGapDegrees"],
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
          id: "referenceDegrees",
          label: "Reference Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unoriented",
          label: "Unoriented",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "acuteGapDegrees",
          label: "Acute Gap Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = toothAxisReferenceAngleTool.execute;
export default toothAxisReferenceAngleTool;
