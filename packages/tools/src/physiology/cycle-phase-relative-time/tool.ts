import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventAt: number;
  readonly origin: number;
  readonly cycleLength: number;
};
export type Output = { readonly phase: number; readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventAt: { type: "number" },
    origin: { type: "number" },
    cycleLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["eventAt", "origin", "cycleLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phase: { type: "number" }, fraction: { type: "number" } },
  required: ["phase", "fraction"],
} as const;
/** Calculate cycle phase relative time from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventAt, origin, cycleLength } = request;
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
    H.positive(cycleLength);
    return {
      phase: wrappedDifference(eventAt, origin, cycleLength),
      fraction: wrappedDifference(eventAt, origin, cycleLength) / cycleLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventAt: 30, origin: 0, cycleLength: 24 },
  output: { phase: 6, fraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const cyclePhaseRelativeTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/cycle-phase-relative-time",
    title: "Cycle Phase Relative Time Tool",
    description:
      "Calculate cycle phase relative time from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventAt: { type: "number" },
        origin: { type: "number" },
        cycleLength: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["eventAt", "origin", "cycleLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phase: { type: "number" }, fraction: { type: "number" } },
      required: ["phase", "fraction"],
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
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleLength",
          label: "Cycle Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "phase", label: "Phase", valueType: { type: "number" } },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cyclePhaseRelativeTimeTool.execute;
export default cyclePhaseRelativeTimeTool;
