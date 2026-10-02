import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly antecedent: boolean;
  readonly consequent: boolean;
};
export type Output = {
  readonly implication: boolean;
  readonly counterexample: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    antecedent: { type: "boolean" },
    consequent: { type: "boolean" },
  },
  required: ["antecedent", "consequent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    implication: { type: "boolean" },
    counterexample: { type: "boolean" },
  },
  required: ["implication", "counterexample"],
} as const;
/** Evaluate classical material implication for two supplied Boolean truth values. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { antecedent, consequent } = request;
  const compute = (): Output => {
    return {
      implication: !antecedent || consequent,
      counterexample: antecedent && !consequent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { antecedent: true, consequent: false },
  output: { implication: false, counterexample: true },
} satisfies ToolExample<Input, Output>;
export const implicationTruthGapTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "philosophy/implication-truth-gap",
      title: "Implication Truth Gap Tool",
      description:
        "Evaluate classical material implication for two supplied Boolean truth values.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          antecedent: { type: "boolean" },
          consequent: { type: "boolean" },
        },
        required: ["antecedent", "consequent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          implication: { type: "boolean" },
          counterexample: { type: "boolean" },
        },
        required: ["implication", "counterexample"],
      },
      ports: {
        inputs: [
          {
            id: "antecedent",
            label: "Antecedent",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "consequent",
            label: "Consequent",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "implication",
            label: "Implication",
            valueType: { type: "boolean" },
          },
          {
            id: "counterexample",
            label: "Counterexample",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = implicationTruthGapTool.execute;
export default implicationTruthGapTool;
