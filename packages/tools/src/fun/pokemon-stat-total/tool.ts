import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  bounded,
  sum,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualSixBaseStats: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualSixBaseStats",
    label: "Actual six base stats",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  if (!input.actualSixBaseStats.length)
    simpleError("actualSixBaseStats", "Actualnonemptyobservations.");
  input.actualSixBaseStats.forEach((v) => nonnegative(v, "actualSixBaseStats"));
  if (input.actualSixBaseStats.length !== 6)
    simpleError("stats", "Actualsixbasestats.");
  input.actualSixBaseStats.forEach((v) => bounded(v, "stat", 0, 1000));
  return { value: sum(input.actualSixBaseStats) };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualSixBaseStats: [50, 50, 50, 50, 50, 50] },
  output: { result: { value: 300 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/pokemon-stat-total",
  title: "Pokemon Stat Total Calculator",
  description:
    "Exactsum sixalreadyactual independently specifiedPokemonbasestat integers,not EV/IVlevelnature calculation or gameplaystrengthforecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
