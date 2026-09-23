import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly baselineStart: number;
  readonly driftPerTime: number;
  readonly elapsed: number;
};
export type Output = { readonly corrected: number; readonly baseline: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    baselineStart: { type: "number" },
    driftPerTime: { type: "number" },
    elapsed: { type: "number", minimum: 0 },
  },
  required: ["signal", "baselineStart", "driftPerTime", "elapsed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { corrected: { type: "number" }, baseline: { type: "number" } },
  required: ["corrected", "baseline"],
} as const;
/** Calculate biosensor baseline drift one interval from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, baselineStart, driftPerTime, elapsed } = request;
  const compute = (): Output => {
    H.domain(elapsed >= 0);
    return {
      corrected: signal - baselineStart - driftPerTime * elapsed,
      baseline: baselineStart + driftPerTime * elapsed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 12, baselineStart: 2, driftPerTime: 0.1, elapsed: 10 },
  output: { corrected: 9, baseline: 3 },
} satisfies ToolExample<Input, Output>;
export const biosensorBaselineDriftOneIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/biosensor-baseline-drift-one-interval",
    title: "Biosensor Baseline Drift One Interval Tool",
    description:
      "Calculate biosensor baseline drift one interval from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        baselineStart: { type: "number" },
        driftPerTime: { type: "number" },
        elapsed: { type: "number", minimum: 0 },
      },
      required: ["signal", "baselineStart", "driftPerTime", "elapsed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        corrected: { type: "number" },
        baseline: { type: "number" },
      },
      required: ["corrected", "baseline"],
    },
    ports: {
      inputs: [
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineStart",
          label: "Baseline Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "driftPerTime",
          label: "Drift Per Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
        { id: "baseline", label: "Baseline", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = biosensorBaselineDriftOneIntervalTool.execute;
export default biosensorBaselineDriftOneIntervalTool;
