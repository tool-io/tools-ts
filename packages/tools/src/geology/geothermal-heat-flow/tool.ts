import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerMatchedThermalConductivityWattsPerMeterKelvin: number;
  readonly actualGeothermalTemperatureGradientKelvinPerMeter: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerMatchedThermalConductivityWattsPerMeterKelvin",
    label: "Caller matched thermal conductivity watts per meter kelvin",
    kind: "number",
  },
  {
    id: "actualGeothermalTemperatureGradientKelvinPerMeter",
    label: "Actual geothermal temperature gradient kelvin per meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.callerMatchedThermalConductivityWattsPerMeterKelvin,
    "conductivity",
  );
  return {
    conditionalConductiveUpwardHeatFluxWattsPerSquareMeter:
      input.callerMatchedThermalConductivityWattsPerMeterKelvin *
      input.actualGeothermalTemperatureGradientKelvinPerMeter,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerMatchedThermalConductivityWattsPerMeterKelvin: 2,
    actualGeothermalTemperatureGradientKelvinPerMeter: 0.03,
  },
  output: {
    result: { conditionalConductiveUpwardHeatFluxWattsPerSquareMeter: 0.06 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/geothermal-heat-flow",
  title: "Geology Geothermal Heat Flow Calculator",
  description:
    "Conductive upward heat fluxk\u00d7downward-positive temperature gradient, SIcoherent. Signed flux retained, not convective geothermal heat or resource/safety assessment.",
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
