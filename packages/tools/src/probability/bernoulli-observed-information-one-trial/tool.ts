import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly mass: number; readonly outcome: number };
export type Output = { readonly information: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number" },
    outcome: { type: "integer", minimum: 0, maximum: 1 },
  },
  required: ["mass", "outcome"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { information: { type: "number" } },
  required: ["information"],
} as const;
/** Compute bernoulli observed information one trial from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { mass, outcome } = input;
  const compute = (): Output => {
    domain(mass > 0 && mass < 1);
    integer(outcome, 0, 1);
    return { information: outcome === 1 ? 1 / mass ** 2 : 1 / (1 - mass) ** 2 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { mass: 0.5, outcome: 1 },
  output: { information: 4 },
} satisfies ToolExample<Input, Output>;
export const bernoulliObservedInformationOneTrialTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "probability/bernoulli-observed-information-one-trial",
  title: "Bernoulli Observed Information One Trial Tool",
  description:
    "Compute bernoulli observed information one trial from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "mass",
        label: "Mass",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "outcome",
        label: "Outcome",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "information",
        label: "Information",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = bernoulliObservedInformationOneTrialTool.execute;
export default bernoulliObservedInformationOneTrialTool;
