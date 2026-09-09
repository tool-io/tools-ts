import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  slopePair,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualDepthCoordinatesMeters: readonly number[];
  readonly actualTemperaturesKelvin: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDepthCoordinatesMeters",
    label: "Actual depth coordinates meters",
    kind: "numberList",
  },
  {
    id: "actualTemperaturesKelvin",
    label: "Actual temperatures kelvin",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  input.actualDepthCoordinatesMeters.forEach((v) => nonnegative(v, "depth"));
  input.actualTemperaturesKelvin.forEach((v) => positive(v, "kelvin"));
  return {
    observedGeothermalGradientKelvinPerMeter: slopePair(
      input.actualDepthCoordinatesMeters,
      input.actualTemperaturesKelvin,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualDepthCoordinatesMeters: [100, 200],
    actualTemperaturesKelvin: [300, 303],
  },
  output: { result: { observedGeothermalGradientKelvinPerMeter: 0.03 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/geothermal-gradient",
  title: "Geology Geothermal Gradient Calculator",
  description:
    "Actual two-level temperature/depth geothermal gradient, not presume conductive heat flow or reservoir extrapolation.",
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
