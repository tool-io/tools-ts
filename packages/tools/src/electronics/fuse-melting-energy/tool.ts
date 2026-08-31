import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  integral,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly sampleTimesSeconds: readonly number[];
  readonly sampleCurrentsA: readonly number[];
  readonly callerFixedElementResistanceOhms: number;
  readonly callerMeltingEnergyJ: number;
}>;
export type Output = Readonly<{
  readonly integratedJouleEnergyJ: number;
  readonly callerMeltingEnergyExceeded: boolean;
  readonly integratedAmpereSquaredSeconds: number;
}>;
const inputFields = [
  {
    id: "sampleTimesSeconds",
    label: "Sample times seconds",
    kind: "numberList",
  },
  { id: "sampleCurrentsA", label: "Sample currents a", kind: "numberList" },
  {
    id: "callerFixedElementResistanceOhms",
    label: "Caller fixed element resistance ohms",
    kind: "number",
  },
  {
    id: "callerMeltingEnergyJ",
    label: "Caller melting energy j",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerFixedElementResistanceOhms,
    "callerFixedElementResistanceOhms",
  );
  input.sampleTimesSeconds.forEach((v) => nonnegative(v, "sampleTimesSeconds"));
  nonnegative(input.callerMeltingEnergyJ, "callerMeltingEnergyJ");
  aligned(
    input.sampleTimesSeconds,
    input.sampleCurrentsA,
    "sampleTimesSeconds",
  );
  const i2 = input.sampleCurrentsA.map((v) => v * v),
    area = integral(input.sampleTimesSeconds, i2),
    energy = area * input.callerFixedElementResistanceOhms;
  return {
    integratedJouleEnergyJ: energy,
    callerMeltingEnergyExceeded: energy >= input.callerMeltingEnergyJ,
    integratedAmpereSquaredSeconds: area,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleTimesSeconds: [0, 1, 2],
  sampleCurrentsA: [0, 2, 0],
  callerFixedElementResistanceOhms: 1,
  callerMeltingEnergyJ: 5,
} satisfies Input;
export const exampleOutput = {
  integratedJouleEnergyJ: 4,
  callerMeltingEnergyExceeded: false,
  integratedAmpereSquaredSeconds: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/fuse-melting-energy",
  title: "Fuse Melting Energy Calculator",
  description:
    "Integrate sampled I² with trapezoids and fixed caller element R to observed Joule energy versus supplied melt-energy screen; not constant-current clearing-time inverse, actual melting temperature, arc clearing or protection coordination.",
  inputs: inputFields,
  outputs: [
    {
      id: "integratedJouleEnergyJ",
      label: "Integrated joule energy j",
      kind: "number",
    },
    {
      id: "callerMeltingEnergyExceeded",
      label: "Caller melting energy exceeded",
      kind: "boolean",
    },
    {
      id: "integratedAmpereSquaredSeconds",
      label: "Integrated ampere squared seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleTimesSeconds: value.sampleTimesSeconds as readonly number[],
      sampleCurrentsA: value.sampleCurrentsA as readonly number[],
      callerFixedElementResistanceOhms:
        value.callerFixedElementResistanceOhms as number,
      callerMeltingEnergyJ: value.callerMeltingEnergyJ as number,
    }),
});
export const run = tool.execute;
export default tool;
