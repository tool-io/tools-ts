import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedEffect: number;
  readonly baselineEffect: number;
  readonly controlEffect: number;
  readonly referenceChange: number;
};
export type Output = {
  readonly baselineChange: number;
  readonly controlAdjustedChange: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedEffect: { type: "number" },
    baselineEffect: { type: "number" },
    controlEffect: { type: "number" },
    referenceChange: { type: "number" },
  },
  required: [
    "observedEffect",
    "baselineEffect",
    "controlEffect",
    "referenceChange",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineChange: { type: "number" },
    controlAdjustedChange: { type: "number" },
    residual: { type: "number" },
  },
  required: ["baselineChange", "controlAdjustedChange", "residual"],
} as const;
/** Calculate nonclinical effect baseline gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedEffect, baselineEffect, controlEffect, referenceChange } =
    request;
  const compute = (): Output => {
    return {
      baselineChange: observedEffect - baselineEffect,
      controlAdjustedChange: observedEffect - baselineEffect - controlEffect,
      residual:
        observedEffect - baselineEffect - controlEffect - referenceChange,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedEffect: 10,
    baselineEffect: 2,
    controlEffect: 3,
    referenceChange: 4,
  },
  output: { baselineChange: 8, controlAdjustedChange: 5, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const nonclinicalEffectBaselineGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/nonclinical-effect-baseline-gap",
    title: "Nonclinical Effect Baseline Gap Tool",
    description:
      "Calculate nonclinical effect baseline gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedEffect: { type: "number" },
        baselineEffect: { type: "number" },
        controlEffect: { type: "number" },
        referenceChange: { type: "number" },
      },
      required: [
        "observedEffect",
        "baselineEffect",
        "controlEffect",
        "referenceChange",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineChange: { type: "number" },
        controlAdjustedChange: { type: "number" },
        residual: { type: "number" },
      },
      required: ["baselineChange", "controlAdjustedChange", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "observedEffect",
          label: "Observed Effect",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baselineEffect",
          label: "Baseline Effect",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "controlEffect",
          label: "Control Effect",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceChange",
          label: "Reference Change",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "baselineChange",
          label: "Baseline Change",
          valueType: { type: "number" },
        },
        {
          id: "controlAdjustedChange",
          label: "Control Adjusted Change",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nonclinicalEffectBaselineGapTool.execute;
export default nonclinicalEffectBaselineGapTool;
