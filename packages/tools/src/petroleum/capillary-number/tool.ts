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
  readonly actualDynamicViscosity: number;
  readonly actualDarcyVelocity: number;
  readonly actualInterfacialTension: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDynamicViscosity",
    label: "Actual dynamic viscosity",
    kind: "number",
  },
  { id: "actualDarcyVelocity", label: "Actual darcy velocity", kind: "number" },
  {
    id: "actualInterfacialTension",
    label: "Actual interfacial tension",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualDynamicViscosity, "actualDynamicViscosity");
  nonnegative(input.actualDarcyVelocity, "actualDarcyVelocity");
  positive(input.actualInterfacialTension, "actualInterfacialTension");
  return {
    value:
      (input.actualDynamicViscosity * input.actualDarcyVelocity) /
      input.actualInterfacialTension,
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
    actualDynamicViscosity: 1,
    actualDarcyVelocity: 1,
    actualInterfacialTension: 2,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/capillary-number",
  title: "Petroleum Capillary Number Calculator",
  description:
    "DeclaredcapillarynumberCa=\u03bcU/\u03c3,SI/superficialDarcyvelocityconvention not porevelocity;no universal displacementefficiency.",
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
