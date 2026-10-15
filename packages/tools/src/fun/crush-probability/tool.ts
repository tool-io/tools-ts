import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sourceFor, draw } from "../batch51-shared.js";
export type Input = Readonly<{ readonly seed: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  const random = sourceFor(input.seed, context);
  return { fictionalEntertainmentPercent: draw(0, 100, random) };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51" },
  output: {
    result: {
      fictionalEntertainmentPercent: 41,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/crush-probability",
  title: "Crush Probability Fun Calculator",
  description:
    "Uniformfictional crush chance partypercentdrawNOTan actualprobability,compatibilitymeasurement or riskprediction;no personalinputs assessed. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { fictionalEntertainmentPercent: { type: "number" } },
        required: ["fictionalEntertainmentPercent"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
