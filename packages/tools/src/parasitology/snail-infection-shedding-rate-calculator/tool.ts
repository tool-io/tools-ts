import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, countFraction } from "../batch53-shared.js";

export type Input = Readonly<{
  sheddingPositiveSnails: number;
  snailsTested: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "sheddingPositiveSnails",
    label: "Shedding positive snails",
    kind: "number",
  },
  { id: "snailsTested", label: "Snails tested", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    observedSheddingPercent:
      100 * countFraction(i.sheddingPositiveSnails, i.snailsTested),
    causalInference: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { sheddingPositiveSnails: 2, snailsTested: 10 },
  output: {
    result: {
      observedSheddingPercent: 20.0,
      causalInference: "not-established",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/snail-infection-shedding-rate-calculator",
  title: "Snail Infection Rate percent Cercarial Shedding Calculator",
  description:
    "Compute the observed Snail Infection Rate percent Cercarial Shedding Calculator fraction from explicit subset and total counts; not a transmission, survival or viability guarantee.",
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
