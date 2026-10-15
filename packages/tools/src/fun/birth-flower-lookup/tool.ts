import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualMonth: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualMonth", label: "Actual month", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  bounded(input.actualMonth, "month", 1, 12);
  return {
    boundedTraditionalChoice: [
      "Carnation",
      "Violet",
      "Daffodil",
      "Daisy",
      "Lily of the valley",
      "Rose",
      "Larkspur",
      "Gladiolus",
      "Aster",
      "Marigold",
      "Chrysanthemum",
      "Narcissus",
    ][input.actualMonth - 1],
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualMonth: 1 },
  output: { result: { boundedTraditionalChoice: "Carnation" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/birth-flower-lookup",
  title: "Birth Flower Lookup",
  description:
    "ExplicitONEcommonWesternmonth birthflower inventory,regional/traditionalalternativesexist,not identityor universaltradition. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { boundedTraditionalChoice: { type: "string" } },
        required: ["boundedTraditionalChoice"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
