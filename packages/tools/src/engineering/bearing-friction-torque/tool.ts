import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerCalibratedEffectiveFrictionCoefficient: number;
  readonly actualBearingRadialLoadNewtons: number;
  readonly callerEffectiveFrictionRadiusMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerCalibratedEffectiveFrictionCoefficient",
    label: "Caller calibrated effective friction coefficient",
    kind: "number",
  },
  {
    id: "actualBearingRadialLoadNewtons",
    label: "Actual bearing radial load new tons",
    kind: "number",
  },
  {
    id: "callerEffectiveFrictionRadiusMeters",
    label: "Caller effective friction radius meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.callerCalibratedEffectiveFrictionCoefficient,
    "callerCalibratedEffectiveFrictionCoefficient",
  );
  nonnegative(
    input.actualBearingRadialLoadNewtons,
    "actualBearingRadialLoadNewtons",
  );
  positive(
    input.callerEffectiveFrictionRadiusMeters,
    "callerEffectiveFrictionRadiusMeters",
  );
  return {
    value:
      input.callerCalibratedEffectiveFrictionCoefficient *
      input.actualBearingRadialLoadNewtons *
      input.callerEffectiveFrictionRadiusMeters,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerCalibratedEffectiveFrictionCoefficient: 0.1,
    actualBearingRadialLoadNewtons: 10,
    callerEffectiveFrictionRadiusMeters: 1,
  },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/bearing-friction-torque",
  title: "Bearing Friction Torque Calculator",
  description:
    "Restricted independently calibrated bearing \u03bcFrfrictiontorque scenario, not hydrodynamic rolling-element vendor law or safe bearing capacity. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
