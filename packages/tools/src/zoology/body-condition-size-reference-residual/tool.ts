import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedMass: number;
  readonly predictedMass: number;
  readonly logScale: boolean;
};
export type Output = {
  readonly residual: number;
  readonly relativeMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMass: { type: "number", exclusiveMinimum: 0 },
    predictedMass: { type: "number", exclusiveMinimum: 0 },
    logScale: { type: "boolean" },
  },
  required: ["observedMass", "predictedMass", "logScale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    relativeMass: { type: "number" },
  },
  required: ["residual", "relativeMass"],
} as const;
/** Observed versus externally predicted mass residual on an explicit arithmetic or log scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedMass, predictedMass, logScale } = request;
  const compute = (): Output => {
    H.positive(observedMass);
    H.positive(predictedMass);
    return {
      residual: logScale
        ? Math.log(observedMass / predictedMass)
        : observedMass - predictedMass,
      relativeMass: observedMass / predictedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedMass: 120, predictedMass: 100, logScale: false },
  output: { residual: 20, relativeMass: 1.2 },
} satisfies ToolExample<Input, Output>;
export const bodyConditionSizeReferenceResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/body-condition-size-reference-residual",
    title: "Body Condition Size Reference Residual Tool",
    description:
      "Observed versus externally predicted mass residual on an explicit arithmetic or log scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedMass: { type: "number", exclusiveMinimum: 0 },
        predictedMass: { type: "number", exclusiveMinimum: 0 },
        logScale: { type: "boolean" },
      },
      required: ["observedMass", "predictedMass", "logScale"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residual: { type: "number" },
        relativeMass: { type: "number" },
      },
      required: ["residual", "relativeMass"],
    },
    ports: {
      inputs: [
        {
          id: "observedMass",
          label: "Observed Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predictedMass",
          label: "Predicted Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "logScale",
          label: "Log Scale",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "relativeMass",
          label: "Relative Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bodyConditionSizeReferenceResidualTool.execute;
export default bodyConditionSizeReferenceResidualTool;
