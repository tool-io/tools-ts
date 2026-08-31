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
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedDisplayPpm: readonly number[];
  readonly callerInstrumentScaleFactors: readonly number[];
  readonly callerOutputScaleFactor: number;
}>;
export type Output = Readonly<{
  readonly scaleEquivalentEcMsCm: readonly number[];
  readonly convertedDisplayPpm: readonly number[];
}>;
const inputFields = [
  {
    id: "observedDisplayPpm",
    label: "Observed display ppm",
    kind: "numberList",
  },
  {
    id: "callerInstrumentScaleFactors",
    label: "Caller instrument scale factors",
    kind: "numberList",
  },
  {
    id: "callerOutputScaleFactor",
    label: "Caller output scale factor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDisplayPpm.forEach((v) => nonnegative(v, "observedDisplayPpm"));
  aligned(
    input.observedDisplayPpm,
    input.callerInstrumentScaleFactors,
    "observedDisplayPpm",
  );
  input.callerInstrumentScaleFactors.forEach((v) => {
    if (v !== 500 && v !== 700)
      simpleError("scale", "Explicit 500/700 display factor required.");
  });
  if (
    input.callerOutputScaleFactor !== 500 &&
    input.callerOutputScaleFactor !== 700
  )
    simpleError("scale", "Explicit output 500/700 display factor required.");
  const ec = input.observedDisplayPpm.map(
    (v, i) => v / input.callerInstrumentScaleFactors[i],
  );
  return {
    scaleEquivalentEcMsCm: ec,
    convertedDisplayPpm: ec.map((v) => v * input.callerOutputScaleFactor),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDisplayPpm: [500, 700],
  callerInstrumentScaleFactors: [500, 700],
  callerOutputScaleFactor: 700,
} satisfies Input;
export const exampleOutput = {
  scaleEquivalentEcMsCm: [1, 1],
  convertedDisplayPpm: [700, 700],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/ppm-ec-500-700-scale-converter",
  title: "PPM EC 500 700 Scale Converter",
  description:
    "Reconcile actual mixed 500/700-scale conductivity-derived ppm displays without pretending display ppm is laboratory mass concentration; no temperature/ion-speciation correction.",
  inputs: inputFields,
  outputs: [
    {
      id: "scaleEquivalentEcMsCm",
      label: "Scale equivalent ec ms cm",
      kind: "numberList",
    },
    {
      id: "convertedDisplayPpm",
      label: "Converted display ppm",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDisplayPpm: value.observedDisplayPpm as readonly number[],
      callerInstrumentScaleFactors:
        value.callerInstrumentScaleFactors as readonly number[],
      callerOutputScaleFactor: value.callerOutputScaleFactor as number,
    }),
});
export const run = tool.execute;
export default tool;
