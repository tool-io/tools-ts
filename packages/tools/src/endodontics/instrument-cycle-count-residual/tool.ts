import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startCount: number;
  readonly endCount: number;
  readonly suppliedExpectedCycles: number;
};
export type Output = {
  readonly observedCycles: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startCount: { type: "integer" },
    endCount: { type: "integer" },
    suppliedExpectedCycles: { type: "integer", minimum: 0 },
  },
  required: ["startCount", "endCount", "suppliedExpectedCycles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedCycles: { type: "integer" },
    residual: { type: "integer" },
  },
  required: ["observedCycles", "residual"],
} as const;
/** Compare supplied non-reset bench cycle counters without instrument-life or reuse recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startCount, endCount, suppliedExpectedCycles } = request;
  const compute = (): Output => {
    H.domain(endCount >= startCount);
    H.integer(suppliedExpectedCycles, 0);
    return {
      observedCycles: endCount - startCount,
      residual: endCount - startCount - suppliedExpectedCycles,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startCount: 100, endCount: 130, suppliedExpectedCycles: 25 },
  output: { observedCycles: 30, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const instrumentCycleCountResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endodontics/instrument-cycle-count-residual",
    title: "Instrument Cycle Count Residual Tool",
    description:
      "Compare supplied non-reset bench cycle counters without instrument-life or reuse recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startCount: { type: "integer" },
        endCount: { type: "integer" },
        suppliedExpectedCycles: { type: "integer", minimum: 0 },
      },
      required: ["startCount", "endCount", "suppliedExpectedCycles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedCycles: { type: "integer" },
        residual: { type: "integer" },
      },
      required: ["observedCycles", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "startCount",
          label: "Start Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endCount",
          label: "End Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedExpectedCycles",
          label: "Supplied Expected Cycles",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "observedCycles",
          label: "Observed Cycles",
          valueType: { type: "integer" },
        },
        { id: "residual", label: "Residual", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = instrumentCycleCountResidualTool.execute;
export default instrumentCycleCountResidualTool;
