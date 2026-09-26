import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly blank: number;
  readonly suppliedLimit: number;
  readonly uncertainty: number;
};
export type Output = {
  readonly corrected: number;
  readonly nominalMargin: number;
  readonly lowerMargin: number;
  readonly upperMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    blank: { type: "number" },
    suppliedLimit: { type: "number" },
    uncertainty: { type: "number", minimum: 0 },
  },
  required: ["signal", "blank", "suppliedLimit", "uncertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    corrected: { type: "number" },
    nominalMargin: { type: "number" },
    lowerMargin: { type: "number" },
    upperMargin: { type: "number" },
  },
  required: ["corrected", "nominalMargin", "lowerMargin", "upperMargin"],
} as const;
/** Report blank-corrected margins against a caller-established detection limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, blank, suppliedLimit, uncertainty } = request;
  const compute = (): Output => {
    H.domain(uncertainty >= 0);
    return {
      corrected: signal - blank,
      nominalMargin: signal - blank - suppliedLimit,
      lowerMargin: signal - blank - suppliedLimit - uncertainty,
      upperMargin: signal - blank - suppliedLimit + uncertainty,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { signal: 12, blank: 2, suppliedLimit: 8, uncertainty: 1 },
  output: { corrected: 10, nominalMargin: 2, lowerMargin: 1, upperMargin: 3 },
} satisfies ToolExample<Input, Output>;
export const ambientBlankDetectionLimitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-health/ambient-blank-detection-limit-gap",
    title: "Ambient Blank Detection Limit Gap Tool",
    description:
      "Report blank-corrected margins against a caller-established detection limit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        blank: { type: "number" },
        suppliedLimit: { type: "number" },
        uncertainty: { type: "number", minimum: 0 },
      },
      required: ["signal", "blank", "suppliedLimit", "uncertainty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        corrected: { type: "number" },
        nominalMargin: { type: "number" },
        lowerMargin: { type: "number" },
        upperMargin: { type: "number" },
      },
      required: ["corrected", "nominalMargin", "lowerMargin", "upperMargin"],
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
          id: "blank",
          label: "Blank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "uncertainty",
          label: "Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
        {
          id: "nominalMargin",
          label: "Nominal Margin",
          valueType: { type: "number" },
        },
        {
          id: "lowerMargin",
          label: "Lower Margin",
          valueType: { type: "number" },
        },
        {
          id: "upperMargin",
          label: "Upper Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ambientBlankDetectionLimitGapTool.execute;
export default ambientBlankDetectionLimitGapTool;
