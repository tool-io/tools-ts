import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedStep: number;
  readonly suppliedDrift: number;
  readonly elapsedTime: number;
};
export type Output = {
  readonly driftStep: number;
  readonly correctedStep: number;
  readonly driftShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedStep: { type: "number" },
    suppliedDrift: { type: "number" },
    elapsedTime: { type: "number", minimum: 0 },
  },
  required: ["observedStep", "suppliedDrift", "elapsedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    driftStep: { type: "number" },
    correctedStep: { type: "number" },
    driftShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["driftStep", "correctedStep", "driftShare", "defined"],
} as const;
/** Subtract supplied signed one-axis drift displacement and report its observed-step share. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedStep, suppliedDrift, elapsedTime } = request;
  const compute = (): Output => {
    H.domain(elapsedTime >= 0);
    return {
      driftStep: suppliedDrift * elapsedTime,
      correctedStep: observedStep - suppliedDrift * elapsedTime,
      driftShare:
        observedStep !== 0 ? (suppliedDrift * elapsedTime) / observedStep : 0,
      defined: observedStep !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedStep: 10, suppliedDrift: 2, elapsedTime: 2 },
  output: { driftStep: 4, correctedStep: 6, driftShare: 0.4, defined: true },
} satisfies ToolExample<Input, Output>;
export const molecularStepDriftShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/molecular-step-drift-share",
    title: "Molecular Step Drift Share Tool",
    description:
      "Subtract supplied signed one-axis drift displacement and report its observed-step share.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedStep: { type: "number" },
        suppliedDrift: { type: "number" },
        elapsedTime: { type: "number", minimum: 0 },
      },
      required: ["observedStep", "suppliedDrift", "elapsedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        driftStep: { type: "number" },
        correctedStep: { type: "number" },
        driftShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["driftStep", "correctedStep", "driftShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "observedStep",
          label: "Observed Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDrift",
          label: "Supplied Drift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedTime",
          label: "Elapsed Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "driftStep", label: "Drift Step", valueType: { type: "number" } },
        {
          id: "correctedStep",
          label: "Corrected Step",
          valueType: { type: "number" },
        },
        {
          id: "driftShare",
          label: "Drift Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = molecularStepDriftShareTool.execute;
export default molecularStepDriftShareTool;
