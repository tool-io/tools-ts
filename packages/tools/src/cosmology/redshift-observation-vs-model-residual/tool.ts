import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedRedshift: number;
  readonly modeledRedshift: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedRedshift: { type: "number", exclusiveMinimum: -1 },
    modeledRedshift: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["observedRedshift", "modeledRedshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Subtract a modeled cosmological redshift from an explicitly matched observation without estimating a cosmological parameter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedRedshift, modeledRedshift } = request;
  const compute = (): Output => {
    H.domain(observedRedshift > -1 && modeledRedshift > -1, "observedRedshift");
    return { residual: observedRedshift - modeledRedshift };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedRedshift: 1.2, modeledRedshift: 1.1 },
  output: { residual: 0.09999999999999987 },
} satisfies ToolExample<Input, Output>;
export const redshiftObservationVsModelResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cosmology", "physics"],
      keywords: ["cosmology", "physics"],
    },
    id: "cosmology/redshift-observation-vs-model-residual",
    title: "Redshift Observation Vs Model Residual",
    description:
      "Subtract a modeled cosmological redshift from an explicitly matched observation without estimating a cosmological parameter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedRedshift: { type: "number", exclusiveMinimum: -1 },
        modeledRedshift: { type: "number", exclusiveMinimum: -1 },
      },
      required: ["observedRedshift", "modeledRedshift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residual: { type: "number" } },
      required: ["residual"],
    },
    ports: {
      inputs: [
        {
          id: "observedRedshift",
          label: "Observed Redshift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "modeledRedshift",
          label: "Modeled Redshift",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = redshiftObservationVsModelResidualTool.execute;
export default redshiftObservationVsModelResidualTool;
