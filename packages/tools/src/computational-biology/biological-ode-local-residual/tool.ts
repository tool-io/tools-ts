import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedDerivative: number;
  readonly modeledDerivative: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDerivative: { type: "number" },
    modeledDerivative: { type: "number" },
  },
  required: ["observedDerivative", "modeledDerivative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Compare explicit observed and modeled derivatives of the same biological state in compatible units without fitting model parameters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedDerivative, modeledDerivative } = request;
  const compute = (): Output => {
    return { residual: observedDerivative - modeledDerivative };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedDerivative: 0.8, modeledDerivative: 0.6 },
  output: { residual: 0.20000000000000007 },
} satisfies ToolExample<Input, Output>;
export const biologicalOdeLocalResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-biology", "computational biology", "biology"],
      keywords: ["computational biology", "biology"],
    },
    id: "computational-biology/biological-ode-local-residual",
    title: "Biological ODE Local Residual",
    description:
      "Compare explicit observed and modeled derivatives of the same biological state in compatible units without fitting model parameters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDerivative: { type: "number" },
        modeledDerivative: { type: "number" },
      },
      required: ["observedDerivative", "modeledDerivative"],
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
          id: "observedDerivative",
          label: "Observed Derivative",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "modeledDerivative",
          label: "Modeled Derivative",
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
export const run = biologicalOdeLocalResidualTool.execute;
export default biologicalOdeLocalResidualTool;
