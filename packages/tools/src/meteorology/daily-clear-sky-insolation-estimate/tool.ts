import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  sum,
  strictlyIncreasing,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedDaySampleSeconds: readonly number[];
  readonly independentlyClearSkyHorizontalIrradianceWM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedWindowClearSkyInsolationJM2: number;
}>;
const inputFields = [
  {
    id: "observedDaySampleSeconds",
    label: "Observed day sample seconds",
    kind: "numberList",
  },
  {
    id: "independentlyClearSkyHorizontalIrradianceWM2",
    label: "Independently clear sky horizontal irradiance w m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.independentlyClearSkyHorizontalIrradianceWM2.forEach((v) =>
    nonnegative(v, "independentlyClearSkyHorizontalIrradianceWM2"),
  );
  aligned(
    input.observedDaySampleSeconds,
    input.independentlyClearSkyHorizontalIrradianceWM2,
    "observedDaySampleSeconds",
  );
  strictlyIncreasing(input.observedDaySampleSeconds, "seconds");
  if (
    input.observedDaySampleSeconds[0] < 0 ||
    input.observedDaySampleSeconds.at(-1)! > 86400
  )
    simpleError(
      "coverage",
      "Explicit 0..86400 day-relative seconds, only supplied window.",
    );
  return {
    observedWindowClearSkyInsolationJM2: sum(
      input.observedDaySampleSeconds
        .slice(1)
        .map(
          (v, i) =>
            (v - input.observedDaySampleSeconds[i]) *
            (input.independentlyClearSkyHorizontalIrradianceWM2[i] / 2 +
              input.independentlyClearSkyHorizontalIrradianceWM2[i + 1] / 2),
        ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDaySampleSeconds: [0, 10, 20],
  independentlyClearSkyHorizontalIrradianceWM2: [0, 100, 0],
} satisfies Input;
export const exampleOutput = {
  observedWindowClearSkyInsolationJM2: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/daily-clear-sky-insolation-estimate",
  title: "Daily Clear Sky Insolation Estimate Calculator",
  description:
    "Integrate independently modeled same-day clear-sky irradiance trace, actual covered window only; no hidden solar geometry/cloud transmission model. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWindowClearSkyInsolationJM2",
      label: "Observed window clear sky insolation j m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDaySampleSeconds:
        value.observedDaySampleSeconds as readonly number[],
      independentlyClearSkyHorizontalIrradianceWM2:
        value.independentlyClearSkyHorizontalIrradianceWM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
