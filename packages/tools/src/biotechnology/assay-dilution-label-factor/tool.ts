import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labeledFactor: number;
  readonly labelIsReciprocal: boolean;
  readonly signal: number;
};
export type Output = {
  readonly multiplier: number;
  readonly correctedSignal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labeledFactor: { type: "number", exclusiveMinimum: 0 },
    labelIsReciprocal: { type: "boolean" },
    signal: { type: "number" },
  },
  required: ["labeledFactor", "labelIsReciprocal", "signal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    multiplier: { type: "number" },
    correctedSignal: { type: "number" },
  },
  required: ["multiplier", "correctedSignal"],
} as const;
/** Interpret an explicitly supplied fraction-versus-reciprocal label without assay or laboratory procedure guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labeledFactor, labelIsReciprocal, signal } = request;
  const compute = (): Output => {
    H.positive(labeledFactor);
    return {
      multiplier: labelIsReciprocal ? labeledFactor : 1 / labeledFactor,
      correctedSignal:
        signal * (labelIsReciprocal ? labeledFactor : 1 / labeledFactor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labeledFactor: 10, labelIsReciprocal: true, signal: 2 },
  output: { multiplier: 10, correctedSignal: 20 },
} satisfies ToolExample<Input, Output>;
export const assayDilutionLabelFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/assay-dilution-label-factor",
    title: "Assay Dilution Label Factor Tool",
    description:
      "Interpret an explicitly supplied fraction-versus-reciprocal label without assay or laboratory procedure guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labeledFactor: { type: "number", exclusiveMinimum: 0 },
        labelIsReciprocal: { type: "boolean" },
        signal: { type: "number" },
      },
      required: ["labeledFactor", "labelIsReciprocal", "signal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        multiplier: { type: "number" },
        correctedSignal: { type: "number" },
      },
      required: ["multiplier", "correctedSignal"],
    },
    ports: {
      inputs: [
        {
          id: "labeledFactor",
          label: "Labeled Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labelIsReciprocal",
          label: "Label Is Reciprocal",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "multiplier",
          label: "Multiplier",
          valueType: { type: "number" },
        },
        {
          id: "correctedSignal",
          label: "Corrected Signal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assayDilutionLabelFactorTool.execute;
export default assayDilutionLabelFactorTool;
