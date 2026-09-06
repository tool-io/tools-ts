import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  strictlyIncreasing,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly k1AmplitudeM: number;
  readonly o1AmplitudeM: number;
  readonly m2AmplitudeM: number;
  readonly s2AmplitudeM: number;
  readonly callerInclusiveFormClassUpper: readonly number[];
}>;
export type Output = Readonly<{
  readonly tidalFormNumber: number;
  readonly callerFormClassIndex: number;
}>;
const inputFields = [
  { id: "k1AmplitudeM", label: "K1 amplitude m", kind: "number" },
  { id: "o1AmplitudeM", label: "O1 amplitude m", kind: "number" },
  { id: "m2AmplitudeM", label: "M2 amplitude m", kind: "number" },
  { id: "s2AmplitudeM", label: "S2 amplitude m", kind: "number" },
  {
    id: "callerInclusiveFormClassUpper",
    label: "Caller inclusive form class upper",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.k1AmplitudeM, "k1AmplitudeM");
  nonnegative(input.o1AmplitudeM, "o1AmplitudeM");
  nonnegative(input.m2AmplitudeM, "m2AmplitudeM");
  nonnegative(input.s2AmplitudeM, "s2AmplitudeM");
  input.callerInclusiveFormClassUpper.forEach((v) =>
    nonnegative(v, "callerInclusiveFormClassUpper"),
  );
  strictlyIncreasing(input.callerInclusiveFormClassUpper, "classes", 1);
  const d = input.m2AmplitudeM + input.s2AmplitudeM;
  positive(d, "semidiurnal denominator");
  const f = (input.k1AmplitudeM + input.o1AmplitudeM) / d,
    index = input.callerInclusiveFormClassUpper.findIndex((v) => f <= v);
  return {
    tidalFormNumber: f,
    callerFormClassIndex:
      index < 0 ? input.callerInclusiveFormClassUpper.length : index,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  k1AmplitudeM: 1,
  o1AmplitudeM: 2,
  m2AmplitudeM: 2,
  s2AmplitudeM: 1,
  callerInclusiveFormClassUpper: [0.25, 1.5, 3],
} satisfies Input;
export const exampleOutput = {
  tidalFormNumber: 1,
  callerFormClassIndex: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/form-number-f-ratio-classifier",
  title: "Form Number F Ratio Classifier",
  description:
    "Constituent form ratio(K1+O1)/(M2+S2) with caller independently chosen inclusive tidal-class edges, no table inference. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    { id: "tidalFormNumber", label: "Tidal form number", kind: "number" },
    {
      id: "callerFormClassIndex",
      label: "Caller form class index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      k1AmplitudeM: value.k1AmplitudeM as number,
      o1AmplitudeM: value.o1AmplitudeM as number,
      m2AmplitudeM: value.m2AmplitudeM as number,
      s2AmplitudeM: value.s2AmplitudeM as number,
      callerInclusiveFormClassUpper:
        value.callerInclusiveFormClassUpper as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
