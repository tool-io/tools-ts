import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, countFraction } from "../batch53-shared.js";

export type Input = Readonly<{
  sporozoitePositiveMosquitoes: number;
  mosquitoesDissected: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "sporozoitePositiveMosquitoes",
    label: "Sporozoite positive mosquitoes",
    kind: "number",
  },
  { id: "mosquitoesDissected", label: "Mosquitoes dissected", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    sporozoiteRatePercent:
      100 *
      countFraction(i.sporozoitePositiveMosquitoes, i.mosquitoesDissected),
    causalInference: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { sporozoitePositiveMosquitoes: 2, mosquitoesDissected: 10 },
  output: {
    result: { sporozoiteRatePercent: 20.0, causalInference: "not-established" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/sporozoite-rate-dissector-calculator",
  title: "Sporozoite Rate percent Salivary Gland Dissector Calculator",
  description:
    "Compute the observed Sporozoite Rate percent Salivary Gland Dissector Calculator fraction from explicit subset and total counts; not a transmission, survival or viability guarantee.",
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
