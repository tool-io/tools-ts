import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly antecedent: boolean;
  readonly consequent: boolean;
};
export type Output = {
  readonly conditional: boolean;
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
    conditional: { type: "boolean" },
    counterexample: { type: "boolean" },
  },
  required: ["conditional", "counterexample"],
} as const;
/** Classical material implication for one supplied truth assignment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { antecedent, consequent } = request;
  const compute = (): Output => {
    return {
      conditional: !antecedent || consequent,
      counterexample: antecedent && !consequent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { antecedent: true, consequent: false },
  output: { conditional: false, counterexample: true },
} satisfies ToolExample<Input, Output>;
export const propositionalConditionalCounterexampleRowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "philosophy/propositional-conditional-counterexample-row",
      title: "Propositional Conditional Counterexample Row Tool",
      description:
        "Classical material implication for one supplied truth assignment.",
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
          conditional: { type: "boolean" },
          counterexample: { type: "boolean" },
        },
        required: ["conditional", "counterexample"],
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
            id: "conditional",
            label: "Conditional",
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
  });
export const run = propositionalConditionalCounterexampleRowTool.execute;
export default propositionalConditionalCounterexampleRowTool;
