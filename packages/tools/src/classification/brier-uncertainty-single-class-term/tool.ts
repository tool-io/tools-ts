import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly prevalence: number };
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { prevalence: { type: "number", minimum: 0, maximum: 1 } },
  required: ["prevalence"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate brier uncertainty single class term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prevalence } = request;
  const compute = (): Output => {
    H.probability(prevalence);
    return { contribution: prevalence * (1 - prevalence) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prevalence: 0.25 },
  output: { contribution: 0.1875 },
} satisfies ToolExample<Input, Output>;
export const brierUncertaintySingleClassTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/brier-uncertainty-single-class-term",
    title: "Brier Uncertainty Single Class Term Tool",
    description:
      "Calculate brier uncertainty single class term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { prevalence: { type: "number", minimum: 0, maximum: 1 } },
      required: ["prevalence"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "prevalence",
          label: "Prevalence",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = brierUncertaintySingleClassTermTool.execute;
export default brierUncertaintySingleClassTermTool;
