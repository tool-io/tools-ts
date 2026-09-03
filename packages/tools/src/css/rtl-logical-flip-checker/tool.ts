import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerLtrPhysicalMarginsPx: readonly number[];
  readonly observedRtlPhysicalMarginsPx: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedRtlFlipResidualsPx: readonly number[];
}>;
const inputFields = [
  {
    id: "callerLtrPhysicalMarginsPx",
    label: "Caller ltr physical margins px",
    kind: "numberList",
  },
  {
    id: "observedRtlPhysicalMarginsPx",
    label: "Observed rtl physical margins px",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.callerLtrPhysicalMarginsPx.length !== 4 ||
    input.observedRtlPhysicalMarginsPx.length !== 4
  )
    simpleError(
      "sides",
      "Explicit top/right/bottom/left for same horizontal-writing layout.",
    );
  const [t, r, b, l] = input.callerLtrPhysicalMarginsPx;
  return {
    signedRtlFlipResidualsPx: input.observedRtlPhysicalMarginsPx.map(
      (v, i) => v - [t, l, b, r][i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLtrPhysicalMarginsPx: [1, 2, 3, 4],
  observedRtlPhysicalMarginsPx: [1, 4, 3, 2],
} satisfies Input;
export const exampleOutput = {
  signedRtlFlipResidualsPx: [0, 0, 0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/rtl-logical-flip-checker",
  title: "RTL Logical Layout Flip Check",
  description:
    "Audit observed RTL physical margins vs independently matched LTR left/right flip, unlike existing logical-side conversion; vertical-writing and direction-insensitive authored rules external. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedRtlFlipResidualsPx",
      label: "Signed rtl flip residuals px",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerLtrPhysicalMarginsPx:
        value.callerLtrPhysicalMarginsPx as readonly number[],
      observedRtlPhysicalMarginsPx:
        value.observedRtlPhysicalMarginsPx as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
