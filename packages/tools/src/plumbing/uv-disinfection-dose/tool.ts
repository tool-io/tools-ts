import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integral,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedUvExposureTimesSeconds: readonly number[];
  readonly observedMatchedUvIntensityMwCm2: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedIntegratedUvFluenceMjCm2: number;
}>;
const inputFields = [
  {
    id: "observedUvExposureTimesSeconds",
    label: "Observed uv exposure times seconds",
    kind: "numberList",
  },
  {
    id: "observedMatchedUvIntensityMwCm2",
    label: "Observed matched uv intensity mw cm2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedUvExposureTimesSeconds.forEach((v) =>
    nonnegative(v, "observedUvExposureTimesSeconds"),
  );
  input.observedMatchedUvIntensityMwCm2.forEach((v) =>
    nonnegative(v, "observedMatchedUvIntensityMwCm2"),
  );
  return {
    observedIntegratedUvFluenceMjCm2: integral(
      input.observedUvExposureTimesSeconds,
      input.observedMatchedUvIntensityMwCm2,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUvExposureTimesSeconds: [0, 2, 4],
  observedMatchedUvIntensityMwCm2: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  observedIntegratedUvFluenceMjCm2: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/uv-disinfection-dose",
  title: "Plumbing Uv Disinfection Dose Calculator",
  description:
    "Integrate actual matched UV intensity trajectory by trapezoids to observed fluence, no uniform field/residence assumption, germicidal wavelength inference or disinfection certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedIntegratedUvFluenceMjCm2",
      label: "Observed integrated uv fluence mj cm2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUvExposureTimesSeconds:
        value.observedUvExposureTimesSeconds as readonly number[],
      observedMatchedUvIntensityMwCm2:
        value.observedMatchedUvIntensityMwCm2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
