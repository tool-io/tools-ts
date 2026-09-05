import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  strictlyIncreasing,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedHeightsM: readonly number[];
  readonly environmentVirtualTemperatureK: readonly number[];
  readonly independentlyDescendedParcelVirtualTemperatureK: readonly number[];
  readonly gravityMS2: number;
}>;
export type Output = Readonly<{ readonly observedDcapeJKg: number }>;
const inputFields = [
  { id: "observedHeightsM", label: "Observed heights m", kind: "numberList" },
  {
    id: "environmentVirtualTemperatureK",
    label: "Environment virtual temperature k",
    kind: "numberList",
  },
  {
    id: "independentlyDescendedParcelVirtualTemperatureK",
    label: "Independently descended parcel virtual temperature k",
    kind: "numberList",
  },
  { id: "gravityMS2", label: "Gravity m s2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.environmentVirtualTemperatureK.forEach((v) =>
    positive(v, "environmentVirtualTemperatureK"),
  );
  input.independentlyDescendedParcelVirtualTemperatureK.forEach((v) =>
    positive(v, "independentlyDescendedParcelVirtualTemperatureK"),
  );
  positive(input.gravityMS2, "gravityMS2");
  aligned(
    input.observedHeightsM,
    input.environmentVirtualTemperatureK,
    "observedHeightsM",
  );
  aligned(
    input.observedHeightsM,
    input.independentlyDescendedParcelVirtualTemperatureK,
    "observedHeightsM",
  );
  strictlyIncreasing(input.observedHeightsM, "ascending height");
  const b = input.environmentVirtualTemperatureK.map(
    (v, i) =>
      (input.gravityMS2 *
        (v - input.independentlyDescendedParcelVirtualTemperatureK[i])) /
      v,
  );
  let e = 0;
  for (let i = 0; i < b.length - 1; i++) {
    const a = b[i],
      c = b[i + 1],
      dz = input.observedHeightsM[i + 1] - input.observedHeightsM[i];
    if (a >= 0 && c >= 0) e += dz * (a / 2 + c / 2);
    else if (a > 0 || c > 0) {
      const hi = Math.max(a, c);
      e += (dz * hi * hi) / (2 * (Math.abs(a) + Math.abs(c)));
    }
  }
  return { observedDcapeJKg: e };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHeightsM: [0, 1, 2],
  environmentVirtualTemperatureK: [300, 300, 300],
  independentlyDescendedParcelVirtualTemperatureK: [290, 300, 310],
  gravityMS2: 10,
} satisfies Input;
export const exampleOutput = {
  observedDcapeJKg: 0.16666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/dcape-downdraft-cape",
  title: "DCAPE Downdraft CAPE Calculator",
  description:
    "Integrate positive downward buoyancy g(TvEnv−TvDescended)/TvEnv over observed height window, resolving linear zero crossings; caller independently descends saturated downdraft parcel, not upward CAPE or full sounding. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "observedDcapeJKg", label: "Observed dcape j kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedHeightsM: value.observedHeightsM as readonly number[],
      environmentVirtualTemperatureK:
        value.environmentVirtualTemperatureK as readonly number[],
      independentlyDescendedParcelVirtualTemperatureK:
        value.independentlyDescendedParcelVirtualTemperatureK as readonly number[],
      gravityMS2: value.gravityMS2 as number,
    }),
});
export const run = tool.execute;
export default tool;
