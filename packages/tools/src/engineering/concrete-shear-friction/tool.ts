import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerEngineerVerifiedFrictionCoefficient: number;
  readonly callerVerifiedEffectiveClampingForceNewtons: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerEngineerVerifiedFrictionCoefficient",
    label: "Caller engineer verified friction coefficient",
    kind: "number",
  },
  {
    id: "callerVerifiedEffectiveClampingForceNewtons",
    label: "Caller verified effective clamping force new tons",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.callerEngineerVerifiedFrictionCoefficient,
    "callerEngineerVerifiedFrictionCoefficient",
  );
  nonnegative(
    input.callerVerifiedEffectiveClampingForceNewtons,
    "callerVerifiedEffectiveClampingForceNewtons",
  );
  return {
    value:
      input.callerEngineerVerifiedFrictionCoefficient *
      input.callerVerifiedEffectiveClampingForceNewtons,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerEngineerVerifiedFrictionCoefficient: 0.5,
    callerVerifiedEffectiveClampingForceNewtons: 10,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/concrete-shear-friction",
  title: "Concrete Shear Friction Calculator",
  description:
    "Restricted engineer-established interface friction capacity\u03bcN, no infer shear reinforcement, strength factor, roughness or concrete code caps. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
