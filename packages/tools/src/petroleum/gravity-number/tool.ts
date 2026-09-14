import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIntrinsicPermeability: number;
  readonly actualAbsolutePhaseDensityDifference: number;
  readonly callerGravity: number;
  readonly actualDynamicViscosity: number;
  readonly actualDarcyVelocity: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIntrinsicPermeability",
    label: "Actual intrinsic permeability",
    kind: "number",
  },
  {
    id: "actualAbsolutePhaseDensityDifference",
    label: "Actual absolute phase density difference",
    kind: "number",
  },
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
  {
    id: "actualDynamicViscosity",
    label: "Actual dynamic viscosity",
    kind: "number",
  },
  { id: "actualDarcyVelocity", label: "Actual darcy velocity", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualIntrinsicPermeability, "actualIntrinsicPermeability");
  nonnegative(
    input.actualAbsolutePhaseDensityDifference,
    "actualAbsolutePhaseDensityDifference",
  );
  positive(input.callerGravity, "callerGravity");
  positive(input.actualDynamicViscosity, "actualDynamicViscosity");
  positive(input.actualDarcyVelocity, "actualDarcyVelocity");
  return {
    value:
      (input.actualIntrinsicPermeability *
        input.actualAbsolutePhaseDensityDifference *
        input.callerGravity) /
      (input.actualDynamicViscosity * input.actualDarcyVelocity),
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
    actualIntrinsicPermeability: 1,
    actualAbsolutePhaseDensityDifference: 2,
    callerGravity: 1,
    actualDynamicViscosity: 1,
    actualDarcyVelocity: 1,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/gravity-number",
  title: "Petroleum Gravity Number Calculator",
  description:
    "Declaredgravity/viscousnumberNg=k|\u0394\u03c1|g/(\u03bcU),actualunits/velocitybasis,not Bondnumber or inferstablefloodfront.",
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
