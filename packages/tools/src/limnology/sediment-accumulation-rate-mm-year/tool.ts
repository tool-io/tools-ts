import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly deeperMarkerDepthMm: number;
  readonly shallowerMarkerDepthMm: number;
  readonly olderMarkerYear: number;
  readonly youngerMarkerYear: number;
}>;
export type Output = Readonly<{
  readonly observedMeanSedimentAccumulationMmYear: number;
}>;
const inputFields = [
  {
    id: "deeperMarkerDepthMm",
    label: "Deeper marker depth mm",
    kind: "number",
  },
  {
    id: "shallowerMarkerDepthMm",
    label: "Shallower marker depth mm",
    kind: "number",
  },
  { id: "olderMarkerYear", label: "Older marker year", kind: "number" },
  { id: "youngerMarkerYear", label: "Younger marker year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.deeperMarkerDepthMm, "deeperMarkerDepthMm");
  nonnegative(input.shallowerMarkerDepthMm, "shallowerMarkerDepthMm");
  integer(input.olderMarkerYear, "olderMarkerYear");
  integer(input.youngerMarkerYear, "youngerMarkerYear");
  if (
    input.deeperMarkerDepthMm < input.shallowerMarkerDepthMm ||
    input.youngerMarkerYear <= input.olderMarkerYear
  )
    simpleError(
      "chronology",
      "Ordered real marker depth/year intervals required.",
    );
  return {
    observedMeanSedimentAccumulationMmYear:
      (input.deeperMarkerDepthMm - input.shallowerMarkerDepthMm) /
      (input.youngerMarkerYear - input.olderMarkerYear),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  deeperMarkerDepthMm: 100,
  shallowerMarkerDepthMm: 50,
  olderMarkerYear: 1950,
  youngerMarkerYear: 2000,
} satisfies Input;
export const exampleOutput = {
  observedMeanSedimentAccumulationMmYear: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/sediment-accumulation-rate-mm-year",
  title: "Sediment Accumulation Rate MM Year Calculator",
  description:
    "Compute observed dated-marker mean sediment thickness accumulation; not radionuclide age inversion, mass accumulation, compaction correction or an assumption of uniform deposition outside markers.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMeanSedimentAccumulationMmYear",
      label: "Observed mean sediment accumulation mm year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      deeperMarkerDepthMm: value.deeperMarkerDepthMm as number,
      shallowerMarkerDepthMm: value.shallowerMarkerDepthMm as number,
      olderMarkerYear: value.olderMarkerYear as number,
      youngerMarkerYear: value.youngerMarkerYear as number,
    }),
});
export const run = tool.execute;
export default tool;
