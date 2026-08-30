import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly inletDryBulbC: number;
  readonly inletWetBulbC: number;
  readonly padSaturationEfficiencyFraction: number;
  readonly downstreamSensibleHeatWatts: number;
  readonly airMassFlowKgPerSecond: number;
  readonly airSpecificHeatJPerKgK: number;
}>;
export type Output = Readonly<{
  readonly padOutletTemperatureC: number;
  readonly occupiedZoneTemperatureC: number;
  readonly netTemperatureDropC: number;
}>;
const inputFields = [
  { id: "inletDryBulbC", label: "Inlet dry bulb c", kind: "number" },
  { id: "inletWetBulbC", label: "Inlet wet bulb c", kind: "number" },
  {
    id: "padSaturationEfficiencyFraction",
    label: "Pad saturation efficiency fraction",
    kind: "number",
  },
  {
    id: "downstreamSensibleHeatWatts",
    label: "Downstream sensible heat watts",
    kind: "number",
  },
  {
    id: "airMassFlowKgPerSecond",
    label: "Air mass flow kg per second",
    kind: "number",
  },
  {
    id: "airSpecificHeatJPerKgK",
    label: "Air specific heat j per kg k",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.airMassFlowKgPerSecond, "airMassFlowKgPerSecond");
  positive(input.airSpecificHeatJPerKgK, "airSpecificHeatJPerKgK");
  nonnegative(input.downstreamSensibleHeatWatts, "downstreamSensibleHeatWatts");
  fraction(
    input.padSaturationEfficiencyFraction,
    "padSaturationEfficiencyFraction",
  );
  if (input.inletWetBulbC > input.inletDryBulbC)
    simpleError("inletWetBulbC", "Wet bulb cannot exceed dry bulb.");
  const padOutletTemperatureC =
      input.inletDryBulbC -
      input.padSaturationEfficiencyFraction *
        (input.inletDryBulbC - input.inletWetBulbC),
    occupiedZoneTemperatureC =
      padOutletTemperatureC +
      input.downstreamSensibleHeatWatts /
        (input.airMassFlowKgPerSecond * input.airSpecificHeatJPerKgK);
  return {
    padOutletTemperatureC,
    occupiedZoneTemperatureC,
    netTemperatureDropC: input.inletDryBulbC - occupiedZoneTemperatureC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  inletDryBulbC: 35,
  inletWetBulbC: 25,
  padSaturationEfficiencyFraction: 0.8,
  downstreamSensibleHeatWatts: 1000,
  airMassFlowKgPerSecond: 1,
  airSpecificHeatJPerKgK: 1000,
} satisfies Input;
export const exampleOutput = {
  padOutletTemperatureC: 27,
  occupiedZoneTemperatureC: 28,
  netTemperatureDropC: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/pad-fan-cooling-degree-drop",
  title: "Pad Fan Cooling Degree Drop",
  description:
    "Model pad cooling from supplied wet bulb and saturation efficiency, then downstream sensible reheating; not a duplicate wet-bulb psychrometric solver or cooling-performance guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "padOutletTemperatureC",
      label: "Pad outlet temperature c",
      kind: "number",
    },
    {
      id: "occupiedZoneTemperatureC",
      label: "Occupied zone temperature c",
      kind: "number",
    },
    {
      id: "netTemperatureDropC",
      label: "Net temperature drop c",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      inletDryBulbC: value.inletDryBulbC as number,
      inletWetBulbC: value.inletWetBulbC as number,
      padSaturationEfficiencyFraction:
        value.padSaturationEfficiencyFraction as number,
      downstreamSensibleHeatWatts: value.downstreamSensibleHeatWatts as number,
      airMassFlowKgPerSecond: value.airMassFlowKgPerSecond as number,
      airSpecificHeatJPerKgK: value.airSpecificHeatJPerKgK as number,
    }),
});
export const run = tool.execute;
export default tool;
