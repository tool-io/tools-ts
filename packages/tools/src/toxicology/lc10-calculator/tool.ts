import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, logEndpoint } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualTestedDoseOrConcentration: readonly number[];
  readonly actualIndependentEndpointFractions: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualTestedDoseOrConcentration",
    label: "Actual tested dose or concentration",
    kind: "numberList",
  },
  {
    id: "actualIndependentEndpointFractions",
    label: "Actual independent endpoint fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    observedLogInterpolatedEndpoint: logEndpoint(
      input.actualTestedDoseOrConcentration,
      input.actualIndependentEndpointFractions,
      0.1,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualTestedDoseOrConcentration: [1, 10, 100],
    actualIndependentEndpointFractions: [0, 0.1, 0.2],
  },
  output: { result: { observedLogInterpolatedEndpoint: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/lc10-calculator",
  title: "LC10 Calculator",
  description:
    "Actual independently qualified LC10actual mortality interpolation in response-versus-logdose coordinates, not existing50 percent endpoint. No extrapolation, statistical curve fit, animal procedure advice or safe-dose claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
