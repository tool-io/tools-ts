import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startLogMar: number;
  readonly steps: number;
  readonly logStep: number;
};
export type Output = {
  readonly endLogMar: number;
  readonly decimalAcuity: number;
  readonly decimalFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startLogMar: { type: "number" },
    steps: { type: "integer" },
    logStep: { type: "number" },
  },
  required: ["startLogMar", "steps", "logStep"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endLogMar: { type: "number" },
    decimalAcuity: { type: "number" },
    decimalFactor: { type: "number" },
  },
  required: ["endLogMar", "decimalAcuity", "decimalFactor"],
} as const;
/** Apply an explicit logMAR step without selecting a chart scoring convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startLogMar, steps, logStep } = request;
  const compute = (): Output => {
    H.domain(logStep > 0 || logStep < 0);
    return {
      endLogMar: startLogMar + steps * logStep,
      decimalAcuity: 10 ** (-startLogMar - steps * logStep),
      decimalFactor: 10 ** (-steps * logStep),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startLogMar: 0.3, steps: 2, logStep: -0.1 },
  output: {
    endLogMar: 0.09999999999999998,
    decimalAcuity: 0.7943282347242815,
    decimalFactor: 1.5848931924611136,
  },
} satisfies ToolExample<Input, Output>;
export const optometricAcuityLogScaleStepFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/optometric-acuity-log-scale-step-factor",
    title: "Optometric Acuity Log Scale Step Factor Tool",
    description:
      "Apply an explicit logMAR step without selecting a chart scoring convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startLogMar: { type: "number" },
        steps: { type: "integer" },
        logStep: { type: "number" },
      },
      required: ["startLogMar", "steps", "logStep"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        endLogMar: { type: "number" },
        decimalAcuity: { type: "number" },
        decimalFactor: { type: "number" },
      },
      required: ["endLogMar", "decimalAcuity", "decimalFactor"],
    },
    ports: {
      inputs: [
        {
          id: "startLogMar",
          label: "Start Log Mar",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "steps",
          label: "Steps",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "logStep",
          label: "Log Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "endLogMar",
          label: "End Log Mar",
          valueType: { type: "number" },
        },
        {
          id: "decimalAcuity",
          label: "Decimal Acuity",
          valueType: { type: "number" },
        },
        {
          id: "decimalFactor",
          label: "Decimal Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = optometricAcuityLogScaleStepFactorTool.execute;
export default optometricAcuityLogScaleStepFactorTool;
