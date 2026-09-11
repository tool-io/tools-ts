import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerMatchedConvectiveHeatTransferCoefficient: number;
  readonly callerMatchedMassTransferCoefficient: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMatchedConvectiveHeatTransferCoefficient",
    label: "Caller matched convective heat transfer coefficient",
    kind: "number",
  },
  {
    id: "callerMatchedMassTransferCoefficient",
    label: "Caller matched mass transfer coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerMatchedConvectiveHeatTransferCoefficient,
    "callerMatchedConvectiveHeatTransferCoefficient",
  );
  positive(
    input.callerMatchedMassTransferCoefficient,
    "callerMatchedMassTransferCoefficient",
  );
  return {
    value:
      input.callerMatchedConvectiveHeatTransferCoefficient /
      input.callerMatchedMassTransferCoefficient,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMatchedConvectiveHeatTransferCoefficient: 4,
    callerMatchedMassTransferCoefficient: 2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/hvac-psychrometric-ratio",
  title: "Psychrometric Ratio Calculator",
  description:
    "Declared psychrometric heat/mass transfer coefficient ratio under independently matched unit convention; not assume universalLewisrelation or air properties. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
