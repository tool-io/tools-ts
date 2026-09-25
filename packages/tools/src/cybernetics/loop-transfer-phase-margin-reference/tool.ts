import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phaseDegrees: number;
  readonly targetMargin: number;
};
export type Output = { readonly phaseMargin: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseDegrees: { type: "number" },
    targetMargin: { type: "number" },
  },
  required: ["phaseDegrees", "targetMargin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phaseMargin: { type: "number" }, gap: { type: "number" } },
  required: ["phaseMargin", "gap"],
} as const;
/** Use an unwrapped negative-feedback phase at an already established unity-gain crossover. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phaseDegrees, targetMargin } = request;
  const compute = (): Output => {
    return {
      phaseMargin: 180 + phaseDegrees,
      gap: 180 + phaseDegrees - targetMargin,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { phaseDegrees: -135, targetMargin: 40 },
  output: { phaseMargin: 45, gap: 5 },
} satisfies ToolExample<Input, Output>;
export const loopTransferPhaseMarginReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/loop-transfer-phase-margin-reference",
    title: "Loop Transfer Phase Margin Reference Tool",
    description:
      "Use an unwrapped negative-feedback phase at an already established unity-gain crossover.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseDegrees: { type: "number" },
        targetMargin: { type: "number" },
      },
      required: ["phaseDegrees", "targetMargin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phaseMargin: { type: "number" }, gap: { type: "number" } },
      required: ["phaseMargin", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "phaseDegrees",
          label: "Phase Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetMargin",
          label: "Target Margin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "phaseMargin",
          label: "Phase Margin",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = loopTransferPhaseMarginReferenceTool.execute;
export default loopTransferPhaseMarginReferenceTool;
