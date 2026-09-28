import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly baseline: number;
  readonly referenceCorrected: number;
};
export type Output = { readonly corrected: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    baseline: { type: "number" },
    referenceCorrected: { type: "number" },
  },
  required: ["signal", "baseline", "referenceCorrected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { corrected: { type: "number" }, residual: { type: "number" } },
  required: ["corrected", "residual"],
} as const;
/** Compare supplied nonclinical assay signals without inferring a clotting time or diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, baseline, referenceCorrected } = request;
  const compute = (): Output => {
    return {
      corrected: signal - baseline,
      residual: signal - baseline - referenceCorrected,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 12, baseline: 2, referenceCorrected: 8 },
  output: { corrected: 10, residual: 2 },
} satisfies ToolExample<Input, Output>;
export const clottingSignalBaselineOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/clotting-signal-baseline-offset",
    title: "Clotting Signal Baseline Offset Tool",
    description:
      "Compare supplied nonclinical assay signals without inferring a clotting time or diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        baseline: { type: "number" },
        referenceCorrected: { type: "number" },
      },
      required: ["signal", "baseline", "referenceCorrected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        corrected: { type: "number" },
        residual: { type: "number" },
      },
      required: ["corrected", "residual"],
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
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceCorrected",
          label: "Reference Corrected",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = clottingSignalBaselineOffsetTool.execute;
export default clottingSignalBaselineOffsetTool;
