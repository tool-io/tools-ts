import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly ec50: number;
  readonly observedFraction: number;
};
export type Output = {
  readonly logConcentrationGap: number;
  readonly halfmaxResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", exclusiveMinimum: 0 },
    ec50: { type: "number", exclusiveMinimum: 0 },
    observedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["concentration", "ec50", "observedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logConcentrationGap: { type: "number" },
    halfmaxResidual: { type: "number" },
  },
  required: ["logConcentrationGap", "halfmaxResidual"],
} as const;
/** Calculate pd hill curve halfmax residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, ec50, observedFraction } = request;
  const compute = (): Output => {
    H.positive(concentration);
    H.positive(ec50);
    H.probability(observedFraction);
    return {
      logConcentrationGap: Math.log(concentration) - Math.log(ec50),
      halfmaxResidual: observedFraction - 0.5,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2, ec50: 2, observedFraction: 0.6 },
  output: { logConcentrationGap: 0, halfmaxResidual: 0.09999999999999998 },
} satisfies ToolExample<Input, Output>;
export const pdHillCurveHalfmaxResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacodynamics/pd-hill-curve-halfmax-residual",
    title: "PD Hill Curve Halfmax Residual Tool",
    description:
      "Calculate pd hill curve halfmax residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", exclusiveMinimum: 0 },
        ec50: { type: "number", exclusiveMinimum: 0 },
        observedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["concentration", "ec50", "observedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logConcentrationGap: { type: "number" },
        halfmaxResidual: { type: "number" },
      },
      required: ["logConcentrationGap", "halfmaxResidual"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ec50",
          label: "Ec50",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedFraction",
          label: "Observed Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "logConcentrationGap",
          label: "Log Concentration Gap",
          valueType: { type: "number" },
        },
        {
          id: "halfmaxResidual",
          label: "Halfmax Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pdHillCurveHalfmaxResidualTool.execute;
export default pdHillCurveHalfmaxResidualTool;
