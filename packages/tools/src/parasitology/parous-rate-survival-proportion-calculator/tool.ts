import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
} from "../batch53-shared.js";

export type Input = Readonly<{ parousFraction: number; cycleDays: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parousFraction", label: "Parous fraction", kind: "number" },
  { id: "cycleDays", label: "Cycle days", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  fraction(i.parousFraction, "parous");
  positive(i.cycleDays, "cycle");
  return {
    conditionalDailySurvival: i.parousFraction ** (1 / i.cycleDays),
    assumption: "stationary-parity-model",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { parousFraction: 0.25, cycleDays: 2 },
  output: {
    result: {
      conditionalDailySurvival: 0.5,
      assumption: "stationary-parity-model",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/parous-rate-survival-proportion-calculator",
  title: "Parous Rate Survival Daily Proportion p Calculator",
  description:
    "Invert the stationary parity model p=P^(1/g); parity is not itself a directly observed daily survival probability.",
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
