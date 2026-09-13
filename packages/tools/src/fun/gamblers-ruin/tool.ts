import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualWinProbability: number;
  readonly actualStartingUnits: number;
  readonly actualTargetUnits: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualWinProbability",
    label: "Actual win probability",
    kind: "number",
  },
  { id: "actualStartingUnits", label: "Actual starting units", kind: "number" },
  { id: "actualTargetUnits", label: "Actual target units", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  fraction(input.actualWinProbability, "actualWinProbability");
  bounded(input.actualStartingUnits, "actualStartingUnits", 1, 1000000);
  bounded(input.actualTargetUnits, "actualTargetUnits", 1, 1000000);
  bounded(input.actualTargetUnits, "target", 2, 1000);
  bounded(input.actualStartingUnits, "start", 1, input.actualTargetUnits - 1);
  return {
    value:
      input.actualWinProbability === 0.5
        ? 1 - input.actualStartingUnits / input.actualTargetUnits
        : input.actualWinProbability === 0
          ? 1
          : input.actualWinProbability === 1
            ? 0
            : 1 -
              Math.expm1(
                input.actualStartingUnits *
                  Math.log(
                    (1 - input.actualWinProbability) /
                      input.actualWinProbability,
                  ),
              ) /
                Math.expm1(
                  input.actualTargetUnits *
                    Math.log(
                      (1 - input.actualWinProbability) /
                        input.actualWinProbability,
                    ),
                ),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualWinProbability: 0.5,
    actualStartingUnits: 2,
    actualTargetUnits: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/gamblers-ruin",
  title: "Gambler's Ruin Probability Calculator",
  description:
    "Finitegambler ruinprobabilitybeforetargetunderindependentunitstakes,nohouse credit/variablebets,0<start<target\u22641000;extremeoverflow rejected.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
