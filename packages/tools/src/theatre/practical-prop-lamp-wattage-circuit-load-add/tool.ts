import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  binary,
  sum,
  unique,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly propLampIds: readonly string[];
  readonly observedPowerW: readonly number[];
  readonly operatingFlags: readonly number[];
  readonly supplyVrms: number;
  readonly callerMatchedPowerFactor: number;
}>;
export type Output = Readonly<{
  readonly observedActivePropPowerW: number;
  readonly estimatedActivePropCurrentArms: number;
  readonly offLampInstalledPowerW: number;
}>;
const inputFields = [
  { id: "propLampIds", label: "Prop lamp ids", kind: "stringList" },
  { id: "observedPowerW", label: "Observed power w", kind: "numberList" },
  { id: "operatingFlags", label: "Operating flags", kind: "numberList" },
  { id: "supplyVrms", label: "Supply vrms", kind: "number" },
  {
    id: "callerMatchedPowerFactor",
    label: "Caller matched power factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.supplyVrms, "supplyVrms");
  positive(input.callerMatchedPowerFactor, "callerMatchedPowerFactor");
  input.observedPowerW.forEach((v) => nonnegative(v, "observedPowerW"));
  binary(input.operatingFlags, "operatingFlags");
  aligned(input.propLampIds, input.observedPowerW, "propLampIds");
  aligned(input.propLampIds, input.operatingFlags, "propLampIds");
  unique(input.propLampIds, "lamps");
  fraction(input.callerMatchedPowerFactor, "powerFactor");
  const active = sum(
      input.observedPowerW.filter((_, i) => input.operatingFlags[i] === 1),
    ),
    off = sum(input.observedPowerW.filter((_, i) => !input.operatingFlags[i]));
  return {
    observedActivePropPowerW: active,
    estimatedActivePropCurrentArms:
      active / input.supplyVrms / input.callerMatchedPowerFactor,
    offLampInstalledPowerW: off,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  propLampIds: ["a", "b"],
  observedPowerW: [60, 100],
  operatingFlags: [1, 0],
  supplyVrms: 100,
  callerMatchedPowerFactor: 0.8,
} satisfies Input;
export const exampleOutput = {
  observedActivePropPowerW: 60,
  estimatedActivePropCurrentArms: 0.75,
  offLampInstalledPowerW: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/practical-prop-lamp-wattage-circuit-load-add",
  title: "Practical Prop Lamp Wattage Circuit Load Add Calculator",
  description:
    "Inventory actual operating practical lamps and estimate matched single-phase RMS current from true watts and caller power factor; not breaker rating, inrush, wiring or electrical safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedActivePropPowerW",
      label: "Observed active prop power w",
      kind: "number",
    },
    {
      id: "estimatedActivePropCurrentArms",
      label: "Estimated active prop current arms",
      kind: "number",
    },
    {
      id: "offLampInstalledPowerW",
      label: "Off lamp installed power w",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      propLampIds: value.propLampIds as readonly string[],
      observedPowerW: value.observedPowerW as readonly number[],
      operatingFlags: value.operatingFlags as readonly number[],
      supplyVrms: value.supplyVrms as number,
      callerMatchedPowerFactor: value.callerMatchedPowerFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
