import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputMass: number;
  readonly measuredOutputMass: number;
  readonly measuredRetainedMass: number;
};
export type Output = { readonly unaccountedMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputMass: { type: "number", minimum: 0 },
    measuredOutputMass: { type: "number", minimum: 0 },
    measuredRetainedMass: { type: "number", minimum: 0 },
  },
  required: ["inputMass", "measuredOutputMass", "measuredRetainedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unaccountedMass: { type: "number" } },
  required: ["unaccountedMass"],
} as const;
/** Reconcile explicit component input, output, and retained masses without asserting degradation or treatment efficacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputMass, measuredOutputMass, measuredRetainedMass } = request;
  const compute = (): Output => {
    H.domain(
      inputMass >= 0 && measuredOutputMass >= 0 && measuredRetainedMass >= 0,
      "inputMass",
    );
    return {
      unaccountedMass: inputMass - measuredOutputMass - measuredRetainedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputMass: 100, measuredOutputMass: 60, measuredRetainedMass: 30 },
  output: { unaccountedMass: 10 },
} satisfies ToolExample<Input, Output>;
export const remediationComponentMassResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioremediation", "biology"],
      keywords: ["bioremediation", "biology"],
    },
    id: "bioremediation/remediation-component-mass-residual",
    title: "Remediation Component Mass Residual",
    description:
      "Reconcile explicit component input, output, and retained masses without asserting degradation or treatment efficacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputMass: { type: "number", minimum: 0 },
        measuredOutputMass: { type: "number", minimum: 0 },
        measuredRetainedMass: { type: "number", minimum: 0 },
      },
      required: ["inputMass", "measuredOutputMass", "measuredRetainedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unaccountedMass: { type: "number" } },
      required: ["unaccountedMass"],
    },
    ports: {
      inputs: [
        {
          id: "inputMass",
          label: "Input Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredOutputMass",
          label: "Measured Output Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredRetainedMass",
          label: "Measured Retained Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unaccountedMass",
          label: "Unaccounted Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = remediationComponentMassResidualTool.execute;
export default remediationComponentMassResidualTool;
