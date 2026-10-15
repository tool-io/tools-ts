import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlySpecifiedImpostorCount: number;
  readonly actualPlayerCount: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIndependentlySpecifiedImpostorCount",
    label: "Actual independently specified impostor count",
    kind: "number",
  },
  { id: "actualPlayerCount", label: "Actual player count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  bounded(
    input.actualIndependentlySpecifiedImpostorCount,
    "actualIndependentlySpecifiedImpostorCount",
    0,
    1000000,
  );
  bounded(input.actualPlayerCount, "actualPlayerCount", 1, 1000000);
  bounded(
    input.actualIndependentlySpecifiedImpostorCount,
    "impostors",
    0,
    input.actualPlayerCount,
  );
  return {
    value:
      input.actualIndependentlySpecifiedImpostorCount / input.actualPlayerCount,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIndependentlySpecifiedImpostorCount: 2,
    actualPlayerCount: 10,
  },
  output: { result: { value: 0.2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/among-us-impostor-odds",
  title: "Among Us Impostor Odds Calculator",
  description:
    "Actualuniformroleassignmentmarginalimpostorfraction,not infer gameplayrolefrombehavior or actualgameversionpolicies.",
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
