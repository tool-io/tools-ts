import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualQclAmbientTemperatureKelvin: number;
  readonly actualElectricalPowerWatts: number;
  readonly actualExtractedOpticalPowerWatts: number;
  readonly callerCalibratedActiveRegionThermalResistanceKelvinPerWatt: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQclAmbientTemperatureKelvin",
    label: "Actual qcl ambient temperature kelvin",
    kind: "number",
  },
  {
    id: "actualElectricalPowerWatts",
    label: "Actual electrical power watts",
    kind: "number",
  },
  {
    id: "actualExtractedOpticalPowerWatts",
    label: "Actual extracted optical power watts",
    kind: "number",
  },
  {
    id: "callerCalibratedActiveRegionThermalResistanceKelvinPerWatt",
    label: "Caller calibrated active region thermal resistance kelvin per watt",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualQclAmbientTemperatureKelvin, "kelvin");
  nonnegative(input.actualElectricalPowerWatts, "electrical");
  nonnegative(input.actualExtractedOpticalPowerWatts, "optical");
  positive(
    input.callerCalibratedActiveRegionThermalResistanceKelvinPerWatt,
    "thermalresistance",
  );
  if (input.actualExtractedOpticalPowerWatts > input.actualElectricalPowerWatts)
    simpleError(
      "power",
      "Declared device optical output within electrical input.",
    );
  return {
    conditionalQclActiveRegionTemperatureKelvin:
      input.actualQclAmbientTemperatureKelvin +
      (input.actualElectricalPowerWatts -
        input.actualExtractedOpticalPowerWatts) *
        input.callerCalibratedActiveRegionThermalResistanceKelvinPerWatt,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQclAmbientTemperatureKelvin: 300,
    actualElectricalPowerWatts: 10,
    actualExtractedOpticalPowerWatts: 2,
    callerCalibratedActiveRegionThermalResistanceKelvinPerWatt: 5,
  },
  output: { result: { conditionalQclActiveRegionTemperatureKelvin: 340 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/qcl-active-region-temperature",
  title: "Semiconductor Qcl Active Region Temperature Calculator",
  description:
    "Steady QCLactive-region scenario from electrical minus extracted optical power, then independently calibrated active-region thermal resistance; not generic power\u00d7Rrise or device junction thermometry. Other heat paths/transients external.",
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
