import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIntervalLifeTableDeaths: number;
  readonly actualStartSurvivorRadix: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIntervalLifeTableDeaths",
    label: "Actual interval life table deaths",
    kind: "number",
  },
  {
    id: "actualStartSurvivorRadix",
    label: "Actual start survivor radix",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(
    input.actualIntervalLifeTableDeaths,
    "actualIntervalLifeTableDeaths",
  );
  positive(input.actualStartSurvivorRadix, "actualStartSurvivorRadix");
  if (input.actualIntervalLifeTableDeaths > input.actualStartSurvivorRadix)
    simpleError("deaths", "Deaths≤starters.");
  return {
    value: input.actualIntervalLifeTableDeaths / input.actualStartSurvivorRadix,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualIntervalLifeTableDeaths: 2, actualStartSurvivorRadix: 10 },
  output: { result: { value: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "actuarial/probability-of-death-qx",
  title: "Probability of Death qx Calculator",
  description: "Actuallife-tableqx=d_x/l_x,countsnotcentraldeathrate.",
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
