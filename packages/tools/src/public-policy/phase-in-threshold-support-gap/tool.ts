import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly phaseStart: number;
  readonly phaseEnd: number;
  readonly observedSupportFraction: number;
};
export type Output = {
  readonly modelSupportFraction: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    phaseStart: { type: "number" },
    phaseEnd: { type: "number" },
    observedSupportFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["value", "phaseStart", "phaseEnd", "observedSupportFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelSupportFraction: { type: "number" },
    residual: { type: "number" },
  },
  required: ["modelSupportFraction", "residual"],
} as const;
/** Compare explicit support with a supplied linear phase-in interval, without policy eligibility advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, phaseStart, phaseEnd, observedSupportFraction } = request;
  const compute = (): Output => {
    H.domain(phaseEnd > phaseStart);
    H.probability(observedSupportFraction);
    return (() => {
      const modelSupportFraction =
        value <= phaseStart
          ? 0
          : value >= phaseEnd
            ? 1
            : (value - phaseStart) / (phaseEnd - phaseStart);
      return {
        modelSupportFraction,
        residual: observedSupportFraction - modelSupportFraction,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    value: 15,
    phaseStart: 10,
    phaseEnd: 20,
    observedSupportFraction: 0.6,
  },
  output: { modelSupportFraction: 0.5, residual: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const phaseInThresholdSupportGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/phase-in-threshold-support-gap",
    title: "Phase In Threshold Support Gap Tool",
    description:
      "Compare explicit support with a supplied linear phase-in interval, without policy eligibility advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        phaseStart: { type: "number" },
        phaseEnd: { type: "number" },
        observedSupportFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["value", "phaseStart", "phaseEnd", "observedSupportFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelSupportFraction: { type: "number" },
        residual: { type: "number" },
      },
      required: ["modelSupportFraction", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "phaseStart",
          label: "Phase Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "phaseEnd",
          label: "Phase End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedSupportFraction",
          label: "Observed Support Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "modelSupportFraction",
          label: "Model Support Fraction",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = phaseInThresholdSupportGapTool.execute;
export default phaseInThresholdSupportGapTool;
