import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly index: number; readonly period: number };
export type Output = {
  readonly phase: number;
  readonly cycle: number;
  readonly boundary: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    index: { type: "integer" },
    period: { type: "integer", minimum: 1 },
  },
  required: ["index", "period"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phase: { type: "integer" },
    cycle: { type: "integer" },
    boundary: { type: "boolean" },
  },
  required: ["phase", "cycle", "boundary"],
} as const;
/** Calculate periodic sample phase boundary token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { index, period } = request;
  const compute = (): Output => {
    H.integer(period, 1);
    const phase = H.mod(index, period);
    return { phase, cycle: Math.floor(index / period), boundary: phase === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { index: -1, period: 4 },
  output: { phase: 3, cycle: -1, boundary: false },
} satisfies ToolExample<Input, Output>;
export const periodicSamplePhaseBoundaryTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/periodic-sample-phase-boundary-token",
    title: "Periodic Sample Phase Boundary Token Tool",
    description:
      "Calculate periodic sample phase boundary token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        index: { type: "integer" },
        period: { type: "integer", minimum: 1 },
      },
      required: ["index", "period"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phase: { type: "integer" },
        cycle: { type: "integer" },
        boundary: { type: "boolean" },
      },
      required: ["phase", "cycle", "boundary"],
    },
    ports: {
      inputs: [
        {
          id: "index",
          label: "Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "period",
          label: "Period",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "phase", label: "Phase", valueType: { type: "integer" } },
        { id: "cycle", label: "Cycle", valueType: { type: "integer" } },
        { id: "boundary", label: "Boundary", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = periodicSamplePhaseBoundaryTokenTool.execute;
export default periodicSamplePhaseBoundaryTokenTool;
