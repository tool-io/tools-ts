import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedExhaustFlowsM3Hour: readonly number[];
  readonly greenhouseAirVolumeM3: number;
  readonly pairedIndoorOutdoorTemperatureDifferenceC: number;
  readonly callerAirVolumetricHeatCapacityJPerM3K: number;
}>;
export type Output = Readonly<{
  readonly observedAirChangesPerHour: number;
  readonly modeledSignedVentilationHeatRemovalW: number;
}>;
const inputFields = [
  {
    id: "observedExhaustFlowsM3Hour",
    label: "Observed exhaust flows m3 hour",
    kind: "numberList",
  },
  {
    id: "greenhouseAirVolumeM3",
    label: "Greenhouse air volume m3",
    kind: "number",
  },
  {
    id: "pairedIndoorOutdoorTemperatureDifferenceC",
    label: "Paired indoor outdoor temperature difference c",
    kind: "number",
  },
  {
    id: "callerAirVolumetricHeatCapacityJPerM3K",
    label: "Caller air volumetric heat capacity j per m3 k",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.greenhouseAirVolumeM3, "greenhouseAirVolumeM3");
  positive(
    input.callerAirVolumetricHeatCapacityJPerM3K,
    "callerAirVolumetricHeatCapacityJPerM3K",
  );
  input.observedExhaustFlowsM3Hour.forEach((v) =>
    nonnegative(v, "observedExhaustFlowsM3Hour"),
  );
  const flow = sum(input.observedExhaustFlowsM3Hour);
  return {
    observedAirChangesPerHour: flow / input.greenhouseAirVolumeM3,
    modeledSignedVentilationHeatRemovalW:
      (flow / 3600) *
      input.callerAirVolumetricHeatCapacityJPerM3K *
      input.pairedIndoorOutdoorTemperatureDifferenceC,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedExhaustFlowsM3Hour: [300, 200],
  greenhouseAirVolumeM3: 100,
  pairedIndoorOutdoorTemperatureDifferenceC: 5,
  callerAirVolumetricHeatCapacityJPerM3K: 1200,
} satisfies Input;
export const exampleOutput = {
  observedAirChangesPerHour: 5,
  modeledSignedVentilationHeatRemovalW: 833.3333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/air-changes-per-hour-cooling",
  title: "Air Changes Per Hour Cooling Calculator",
  description:
    "Account actual nonoverlapping measured exhaust streams and signed sensible heat removal at paired temperature contrast; no nominal fan-sum guarantee, cooling control prescription or leakage/latent model.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAirChangesPerHour",
      label: "Observed air changes per hour",
      kind: "number",
    },
    {
      id: "modeledSignedVentilationHeatRemovalW",
      label: "Modeled signed ventilation heat removal w",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedExhaustFlowsM3Hour:
        value.observedExhaustFlowsM3Hour as readonly number[],
      greenhouseAirVolumeM3: value.greenhouseAirVolumeM3 as number,
      pairedIndoorOutdoorTemperatureDifferenceC:
        value.pairedIndoorOutdoorTemperatureDifferenceC as number,
      callerAirVolumetricHeatCapacityJPerM3K:
        value.callerAirVolumetricHeatCapacityJPerM3K as number,
    }),
});
export const run = tool.execute;
export default tool;
