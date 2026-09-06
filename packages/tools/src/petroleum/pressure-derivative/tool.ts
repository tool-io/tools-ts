import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  strictlyIncreasing,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedPressureDerivativeTimesSeconds: readonly number[];
  readonly observedPressureChangePa: readonly number[];
}>;
export type Output = Readonly<{
  readonly interiorBourdetPressureDerivativePa: readonly number[];
  readonly interiorDerivativeTimesSeconds: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPressureDerivativeTimesSeconds",
    label: "Observed pressure derivative times seconds",
    kind: "numberList",
  },
  {
    id: "observedPressureChangePa",
    label: "Observed pressure change pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPressureDerivativeTimesSeconds.forEach((v) =>
    positive(v, "observedPressureDerivativeTimesSeconds"),
  );
  aligned(
    input.observedPressureDerivativeTimesSeconds,
    input.observedPressureChangePa,
    "trace",
  );
  strictlyIncreasing(input.observedPressureDerivativeTimesSeconds, "time", 3);
  const l = input.observedPressureDerivativeTimesSeconds.map(Math.log),
    p = input.observedPressureChangePa;
  return {
    interiorBourdetPressureDerivativePa: l.slice(1, -1).map((v, i) => {
      const a = v - l[i],
        b = l[i + 2] - v;
      positive(a, "log left interval");
      positive(b, "log right interval");
      return (
        (((p[i + 1] - p[i]) / a) * b + ((p[i + 2] - p[i + 1]) / b) * a) /
        (a + b)
      );
    }),
    interiorDerivativeTimesSeconds:
      input.observedPressureDerivativeTimesSeconds.slice(1, -1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPressureDerivativeTimesSeconds: [
    1, 2.718281828459045, 7.3890560989306495,
  ],
  observedPressureChangePa: [0, 1, 2],
} satisfies Input;
export const exampleOutput = {
  interiorBourdetPressureDerivativePa: [1],
  interiorDerivativeTimesSeconds: [2.718281828459045],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/pressure-derivative",
  title: "Petroleum Pressure Derivative Calculator",
  description:
    "Explicit three-point Bourdet derivative dP/dln(time) with opposite-side logarithmic interval weights on actual unequal sample times, not uniform finite differences or automatic well-test regime diagnosis. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "interiorBourdetPressureDerivativePa",
      label: "Interior bourdet pressure derivative pa",
      kind: "numberList",
    },
    {
      id: "interiorDerivativeTimesSeconds",
      label: "Interior derivative times seconds",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPressureDerivativeTimesSeconds:
        value.observedPressureDerivativeTimesSeconds as readonly number[],
      observedPressureChangePa:
        value.observedPressureChangePa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
