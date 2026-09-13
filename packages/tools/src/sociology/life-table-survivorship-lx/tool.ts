import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualBeginningIntervalSurvivors: number;
  readonly actualIntervalDeaths: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBeginningIntervalSurvivors",
    label: "Actual beginning interval survivors",
    kind: "number",
  },
  {
    id: "actualIntervalDeaths",
    label: "Actual interval deaths",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualBeginningIntervalSurvivors,
    "actualBeginningIntervalSurvivors",
  );
  nonnegative(input.actualIntervalDeaths, "actualIntervalDeaths");
  if (input.actualIntervalDeaths > input.actualBeginningIntervalSurvivors)
    simpleError("lifeTable", "Deaths≤starts.");
  return {
    value: input.actualBeginningIntervalSurvivors - input.actualIntervalDeaths,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualBeginningIntervalSurvivors: 10, actualIntervalDeaths: 2 },
  output: { result: { value: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/life-table-survivorship-lx",
  title: "Life Table Survivorship Lx Calculator",
  description:
    "Life-table lower case l(next)=l(current)\u2212actualintervaldeathsd, not uppercaseLpersonyears or life expectancy; actual nonnegative ordered counts.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
