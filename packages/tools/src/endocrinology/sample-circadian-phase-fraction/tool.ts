import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleAt: number;
  readonly cycleOrigin: number;
  readonly cycleDuration: number;
};
export type Output = { readonly phaseFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleAt: { type: "number" },
    cycleOrigin: { type: "number" },
    cycleDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleAt", "cycleOrigin", "cycleDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseFraction: { type: "number" } },
  required: ["phaseFraction"],
} as const;
/** Locate a research sample on a caller-defined periodic clock; no biological phase is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleAt, cycleOrigin, cycleDuration } = request;
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
    H.positive(cycleDuration);
    return {
      phaseFraction:
        wrappedDifference(sampleAt, cycleOrigin, cycleDuration) / cycleDuration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleAt: 30, cycleOrigin: 0, cycleDuration: 24 },
  output: { phaseFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const sampleCircadianPhaseFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/sample-circadian-phase-fraction",
    title: "Sample Circadian Phase Fraction Tool",
    description:
      "Locate a research sample on a caller-defined periodic clock; no biological phase is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleAt: { type: "number" },
        cycleOrigin: { type: "number" },
        cycleDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampleAt", "cycleOrigin", "cycleDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phaseFraction: { type: "number" } },
      required: ["phaseFraction"],
    },
    ports: {
      inputs: [
        {
          id: "sampleAt",
          label: "Sample At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleOrigin",
          label: "Cycle Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleDuration",
          label: "Cycle Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseFraction",
          label: "Phase Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleCircadianPhaseFractionTool.execute;
export default sampleCircadianPhaseFractionTool;
