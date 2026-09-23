import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventAt: number;
  readonly cycleOrigin: number;
  readonly cycleDuration: number;
  readonly referenceFraction: number;
};
export type Output = {
  readonly phaseFraction: number;
  readonly signedReferenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventAt: { type: "number" },
    cycleOrigin: { type: "number" },
    cycleDuration: { type: "number", exclusiveMinimum: 0 },
    referenceFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["eventAt", "cycleOrigin", "cycleDuration", "referenceFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseFraction: { type: "number" },
    signedReferenceGap: { type: "number" },
  },
  required: ["phaseFraction", "signedReferenceGap"],
} as const;
/** Calculate cardiac cycle phase offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventAt, cycleOrigin, cycleDuration, referenceFraction } = request;
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
    H.probability(referenceFraction);
    return {
      phaseFraction:
        wrappedDifference(eventAt, cycleOrigin, cycleDuration) / cycleDuration,
      signedReferenceGap:
        wrappedDifference(eventAt, cycleOrigin, cycleDuration) / cycleDuration -
        referenceFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventAt: 3,
    cycleOrigin: 0,
    cycleDuration: 2,
    referenceFraction: 0.25,
  },
  output: { phaseFraction: 0.5, signedReferenceGap: 0.25 },
} satisfies ToolExample<Input, Output>;
export const cardiacCyclePhaseOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/cardiac-cycle-phase-offset",
    title: "Cardiac Cycle Phase Offset Tool",
    description:
      "Calculate cardiac cycle phase offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventAt: { type: "number" },
        cycleOrigin: { type: "number" },
        cycleDuration: { type: "number", exclusiveMinimum: 0 },
        referenceFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "eventAt",
        "cycleOrigin",
        "cycleDuration",
        "referenceFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseFraction: { type: "number" },
        signedReferenceGap: { type: "number" },
      },
      required: ["phaseFraction", "signedReferenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "eventAt",
          label: "Event At",
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
        {
          id: "referenceFraction",
          label: "Reference Fraction",
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
        {
          id: "signedReferenceGap",
          label: "Signed Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cardiacCyclePhaseOffsetTool.execute;
export default cardiacCyclePhaseOffsetTool;
