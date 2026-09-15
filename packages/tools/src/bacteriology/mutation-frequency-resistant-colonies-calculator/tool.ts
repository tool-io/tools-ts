import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, countFraction } from "../batch53-shared.js";

export type Input = Readonly<{
  resistantColonies: number;
  totalViableColonies: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "resistantColonies", label: "Resistant colonies", kind: "number" },
  { id: "totalViableColonies", label: "Total viable colonies", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    observedMutationFrequency: countFraction(
      i.resistantColonies,
      i.totalViableColonies,
    ),
    mutationRatePerGeneration: "not-estimated",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { resistantColonies: 2, totalViableColonies: 1000 },
  output: {
    result: {
      observedMutationFrequency: 0.002,
      mutationRatePerGeneration: "not-estimated",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/mutation-frequency-resistant-colonies-calculator",
  title: "Mutation Frequency Resistant Colonies per Total Calculator",
  description:
    "Compute resistant colony fraction, not a Luria-Delbruck mutation rate or a per-generation rate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
