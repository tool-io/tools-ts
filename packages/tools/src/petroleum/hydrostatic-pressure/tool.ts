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
  readonly actualFluidDensityKgPerM3: number;
  readonly callerGravity: number;
  readonly actualVerticalFluidColumnMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualFluidDensityKgPerM3",
    label: "Actual fluid density kg per m3",
    kind: "number",
  },
  { id: "callerGravity", label: "Caller gravity", kind: "number" },
  {
    id: "actualVerticalFluidColumnMeters",
    label: "Actual vertical fluid column meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualFluidDensityKgPerM3, "actualFluidDensityKgPerM3");
  positive(input.callerGravity, "callerGravity");
  nonnegative(
    input.actualVerticalFluidColumnMeters,
    "actualVerticalFluidColumnMeters",
  );
  return {
    value:
      input.actualFluidDensityKgPerM3 *
      input.callerGravity *
      input.actualVerticalFluidColumnMeters,
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
    actualFluidDensityKgPerM3: 1000,
    callerGravity: 9.81,
    actualVerticalFluidColumnMeters: 1,
  },
  output: { result: { value: 9810 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/hydrostatic-pressure",
  title: "Petroleum Hydrostatic Pressure Calculator",
  description:
    "Actualconstant-densityhydrostaticgaugepressurePa\u03c1gh,no formationfracturepressureor operationalpressure selection.",
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
