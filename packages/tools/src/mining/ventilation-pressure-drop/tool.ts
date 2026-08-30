import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly airQuantityM3PerSecond: number;
  readonly seriesAtkinsonResistances: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalResistance: number;
  readonly pressureDropPa: number;
  readonly airPowerWatts: number;
}>;
const inputFields = [
  {
    id: "airQuantityM3PerSecond",
    label: "Air quantity m3 per second",
    kind: "number",
  },
  {
    id: "seriesAtkinsonResistances",
    label: "Series atkinson resistances",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.airQuantityM3PerSecond, "airQuantityM3PerSecond");
  input.seriesAtkinsonResistances.forEach((v) =>
    nonnegative(v, "seriesAtkinsonResistances"),
  );
  if (!input.seriesAtkinsonResistances.length)
    simpleError(
      "seriesAtkinsonResistances",
      "Nonempty series resistances required.",
    );
  const totalResistance = input.seriesAtkinsonResistances.reduce(
      (a, b) => a + b,
      0,
    ),
    pressureDropPa = totalResistance * input.airQuantityM3PerSecond ** 2;
  return {
    totalResistance,
    pressureDropPa,
    airPowerWatts: pressureDropPa * input.airQuantityM3PerSecond,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  airQuantityM3PerSecond: 10,
  seriesAtkinsonResistances: [1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  totalResistance: 6,
  pressureDropPa: 600,
  airPowerWatts: 6000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ventilation-pressure-drop",
  title: "Ventilation Pressure Drop",
  description:
    "Sum series Atkinson resistances in Pa/(m³/s)² and compute pressure drop/air power; parallel networks and fans are not solved.",
  inputs: inputFields,
  outputs: [
    { id: "totalResistance", label: "Total resistance", kind: "number" },
    { id: "pressureDropPa", label: "Pressure drop pa", kind: "number" },
    { id: "airPowerWatts", label: "Air power watts", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      airQuantityM3PerSecond: value.airQuantityM3PerSecond as number,
      seriesAtkinsonResistances:
        value.seriesAtkinsonResistances as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
