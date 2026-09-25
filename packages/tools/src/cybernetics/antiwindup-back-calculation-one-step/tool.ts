import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly integral: number;
  readonly error: number;
  readonly ki: number;
  readonly unconstrained: number;
  readonly saturated: number;
  readonly trackingGain: number;
  readonly step: number;
};
export type Output = {
  readonly trackingCorrection: number;
  readonly nextIntegral: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integral: { type: "number" },
    error: { type: "number" },
    ki: { type: "number" },
    unconstrained: { type: "number" },
    saturated: { type: "number" },
    trackingGain: { type: "number", minimum: 0 },
    step: { type: "number", minimum: 0 },
  },
  required: [
    "integral",
    "error",
    "ki",
    "unconstrained",
    "saturated",
    "trackingGain",
    "step",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trackingCorrection: { type: "number" },
    nextIntegral: { type: "number" },
  },
  required: ["trackingCorrection", "nextIntegral"],
} as const;
/** Calculate antiwindup back calculation one step from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { integral, error, ki, unconstrained, saturated, trackingGain, step } =
    request;
  const compute = (): Output => {
    H.domain(trackingGain >= 0 && step >= 0);
    return {
      trackingCorrection: trackingGain * (saturated - unconstrained) * step,
      nextIntegral:
        integral +
        step * (ki * error + trackingGain * (saturated - unconstrained)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    integral: 10,
    error: 2,
    ki: 1,
    unconstrained: 20,
    saturated: 15,
    trackingGain: 0.5,
    step: 2,
  },
  output: { trackingCorrection: -5, nextIntegral: 9 },
} satisfies ToolExample<Input, Output>;
export const antiwindupBackCalculationOneStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/antiwindup-back-calculation-one-step",
    title: "Antiwindup Back Calculation One Step Tool",
    description:
      "Calculate antiwindup back calculation one step from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        integral: { type: "number" },
        error: { type: "number" },
        ki: { type: "number" },
        unconstrained: { type: "number" },
        saturated: { type: "number" },
        trackingGain: { type: "number", minimum: 0 },
        step: { type: "number", minimum: 0 },
      },
      required: [
        "integral",
        "error",
        "ki",
        "unconstrained",
        "saturated",
        "trackingGain",
        "step",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trackingCorrection: { type: "number" },
        nextIntegral: { type: "number" },
      },
      required: ["trackingCorrection", "nextIntegral"],
    },
    ports: {
      inputs: [
        {
          id: "integral",
          label: "Integral",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "error",
          label: "Error",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ki",
          label: "Ki",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unconstrained",
          label: "Unconstrained",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "saturated",
          label: "Saturated",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "trackingGain",
          label: "Tracking Gain",
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
        {
          id: "trackingCorrection",
          label: "Tracking Correction",
          valueType: { type: "number" },
        },
        {
          id: "nextIntegral",
          label: "Next Integral",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = antiwindupBackCalculationOneStepTool.execute;
export default antiwindupBackCalculationOneStepTool;
