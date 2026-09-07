import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedQfnExposedPadWidthMm: number;
  readonly observedQfnExposedPadHeightMm: number;
  readonly callerVerifiedStencilWindowWidthsMm: readonly number[];
  readonly callerVerifiedStencilWindowHeightsMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedExposedPadAreaMm2: number;
  readonly totalCallerStencilWindowAreaMm2: number;
  readonly callerStencilAreaFractionOfPad: number;
}>;
const inputFields = [
  {
    id: "observedQfnExposedPadWidthMm",
    label: "Observed qfn exposed pad width mm",
    kind: "number",
  },
  {
    id: "observedQfnExposedPadHeightMm",
    label: "Observed qfn exposed pad height mm",
    kind: "number",
  },
  {
    id: "callerVerifiedStencilWindowWidthsMm",
    label: "Caller verified stencil window widths mm",
    kind: "numberList",
  },
  {
    id: "callerVerifiedStencilWindowHeightsMm",
    label: "Caller verified stencil window heights mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedQfnExposedPadWidthMm, "observedQfnExposedPadWidthMm");
  positive(
    input.observedQfnExposedPadHeightMm,
    "observedQfnExposedPadHeightMm",
  );
  input.callerVerifiedStencilWindowWidthsMm.forEach((v) =>
    positive(v, "callerVerifiedStencilWindowWidthsMm"),
  );
  input.callerVerifiedStencilWindowHeightsMm.forEach((v) =>
    positive(v, "callerVerifiedStencilWindowHeightsMm"),
  );
  aligned(
    input.callerVerifiedStencilWindowWidthsMm,
    input.callerVerifiedStencilWindowHeightsMm,
    "callerVerifiedStencilWindowWidthsMm",
  );
  const pad =
      input.observedQfnExposedPadWidthMm * input.observedQfnExposedPadHeightMm,
    windows = sum(
      input.callerVerifiedStencilWindowWidthsMm.map(
        (v, i) => v * input.callerVerifiedStencilWindowHeightsMm[i],
      ),
    );
  if (windows > pad)
    simpleError(
      "stencil",
      "Independent nonoverlapping inside-pad window inventory cannot exceed pad area.",
    );
  return {
    observedExposedPadAreaMm2: pad,
    totalCallerStencilWindowAreaMm2: windows,
    callerStencilAreaFractionOfPad: windows / pad,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedQfnExposedPadWidthMm: 4,
  observedQfnExposedPadHeightMm: 3,
  callerVerifiedStencilWindowWidthsMm: [1, 2],
  callerVerifiedStencilWindowHeightsMm: [1, 2],
} satisfies Input;
export const exampleOutput = {
  observedExposedPadAreaMm2: 12,
  totalCallerStencilWindowAreaMm2: 5,
  callerStencilAreaFractionOfPad: 0.4166666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/qfn-ground-pad-size",
  title: "Semiconductor Qfn Ground Pad Size Calculator",
  description:
    "Reconcile measured QFN exposed-pad footprint with independently verified nonoverlapping stencil window inventory; not recommending paste percentage, thermal grounding adequacy or pad design.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedExposedPadAreaMm2",
      label: "Observed exposed pad area mm2",
      kind: "number",
    },
    {
      id: "totalCallerStencilWindowAreaMm2",
      label: "Total caller stencil window area mm2",
      kind: "number",
    },
    {
      id: "callerStencilAreaFractionOfPad",
      label: "Caller stencil area fraction of pad",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedQfnExposedPadWidthMm:
        value.observedQfnExposedPadWidthMm as number,
      observedQfnExposedPadHeightMm:
        value.observedQfnExposedPadHeightMm as number,
      callerVerifiedStencilWindowWidthsMm:
        value.callerVerifiedStencilWindowWidthsMm as readonly number[],
      callerVerifiedStencilWindowHeightsMm:
        value.callerVerifiedStencilWindowHeightsMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
