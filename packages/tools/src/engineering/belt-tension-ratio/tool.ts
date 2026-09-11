import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerMatchedBeltFrictionCoefficient: number;
  readonly actualWrapAngleRadians: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMatchedBeltFrictionCoefficient",
    label: "Caller matched belt friction coefficient",
    kind: "number",
  },
  {
    id: "actualWrapAngleRadians",
    label: "Actual wrap angle radians",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerMatchedBeltFrictionCoefficient,
    "callerMatchedBeltFrictionCoefficient",
  );
  nonnegative(input.actualWrapAngleRadians, "actualWrapAngleRadians");
  return {
    value: Math.exp(
      input.callerMatchedBeltFrictionCoefficient * input.actualWrapAngleRadians,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMatchedBeltFrictionCoefficient: 0.5,
    actualWrapAngleRadians: 2,
  },
  output: { result: { value: 2.718281828459045 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/belt-tension-ratio",
  title: "Belt Tension Ratio Calculator",
  description:
    "Ideal Euler\u2013Eytelweinflatbelt limiting Ttight/Tslackexp(\u03bc\u03b8), no Vgroove/centrifugal/dynamic effects or permissible tension inferred. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
