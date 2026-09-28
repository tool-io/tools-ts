import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseline: number;
  readonly origin: number;
  readonly step: number;
};
export type Output = { readonly phase: number; readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseline: { type: "number" },
    origin: { type: "number" },
    step: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["baseline", "origin", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phase: { type: "number" }, fraction: { type: "number" } },
  required: ["phase", "fraction"],
} as const;
/** Return one baseline’s modular phase relative to a supplied grid origin; no snapping or rounding. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseline, origin, step } = request;
  const compute = (): Output => {
    H.positive(step);
    const r = (baseline - origin) % step,
      phase = r < 0 ? r + step : r;
    return { phase, fraction: phase / step };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseline: 7, origin: 0, step: 3 },
  output: { phase: 1, fraction: 0.3333333333333333 },
} satisfies ToolExample<Input, Output>;
export const baselineGridPhaseOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/baseline-grid-phase-offset",
    title: "Baseline Grid Phase Offset Tool",
    description:
      "Return one baseline’s modular phase relative to a supplied grid origin; no snapping or rounding.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseline: { type: "number" },
        origin: { type: "number" },
        step: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["baseline", "origin", "step"],
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
          id: "baseline",
          label: "Baseline",
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
          id: "step",
          label: "Step",
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
export const run = baselineGridPhaseOffsetTool.execute;
export default baselineGridPhaseOffsetTool;
