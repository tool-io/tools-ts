import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  nonnegative,
  strictlyIncreasing,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly verifiedTemperaturesKelvin: readonly number[];
  readonly matchedSeebeckVoltsPerKelvin: readonly number[];
  readonly matchedConductivitiesSiemensPerMeter: readonly number[];
  readonly matchedTotalThermalConductivitiesWattsPerMeterKelvin: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedTemperaturesKelvin",
    label: "Verified temperatures kelvin",
    kind: "numberList",
  },
  {
    id: "matchedSeebeckVoltsPerKelvin",
    label: "Matched seebeck volts per kelvin",
    kind: "numberList",
  },
  {
    id: "matchedConductivitiesSiemensPerMeter",
    label: "Matched conductivities siemens per meter",
    kind: "numberList",
  },
  {
    id: "matchedTotalThermalConductivitiesWattsPerMeterKelvin",
    label: "Matched total thermal conductivities watts per meter kelvin",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  for (const v of [
    input.matchedSeebeckVoltsPerKelvin,
    input.matchedConductivitiesSiemensPerMeter,
    input.matchedTotalThermalConductivitiesWattsPerMeterKelvin,
  ])
    aligned(input.verifiedTemperaturesKelvin, v, "temperatures");
  strictlyIncreasing(input.verifiedTemperaturesKelvin, "temperatures", 2);
  input.verifiedTemperaturesKelvin.forEach((v) => positive(v, "kelvin"));
  input.matchedConductivitiesSiemensPerMeter.forEach((v) =>
    nonnegative(v, "conductivity"),
  );
  input.matchedTotalThermalConductivitiesWattsPerMeterKelvin.forEach((v) =>
    positive(v, "total-kappa"),
  );
  return {
    conditionalZtByTemperature: input.verifiedTemperaturesKelvin.map(
      (v, i) =>
        (input.matchedSeebeckVoltsPerKelvin[i] ** 2 *
          input.matchedConductivitiesSiemensPerMeter[i] *
          v) /
        input.matchedTotalThermalConductivitiesWattsPerMeterKelvin[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    verifiedTemperaturesKelvin: [300, 600],
    matchedSeebeckVoltsPerKelvin: [0.001, 0.001],
    matchedConductivitiesSiemensPerMeter: [1000, 1000],
    matchedTotalThermalConductivitiesWattsPerMeterKelvin: [1, 1],
  },
  output: { result: { conditionalZtByTemperature: [0.3, 0.6] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/thermoelectric-zt-vs-temperature",
  title: "Semiconductor Thermoelectric Zt Vs Temperature Calculator",
  description:
    "Actual matched-temperature thermoelectric ZT=S\u00b2\u03c3T/total\u03bausing coherent SIunits, including independently established electronic+phononic thermal conductivity. Not efficiency, material optimization or a universal temperature forecast.",
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
