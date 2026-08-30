import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly polishLineLuminance: number;
  readonly adjacentFacetLuminance: number;
  readonly callerRequiredMichelsonContrast: number;
  readonly measuredLineWidthMicrometers: number;
  readonly callerResolvableWidthMicrometers: number;
}>;
export type Output = Readonly<{
  readonly observedLineMichelsonContrast: number;
  readonly meetsCallerContrastAndWidthCriterion: boolean;
}>;
const inputFields = [
  { id: "polishLineLuminance", label: "Polish line luminance", kind: "number" },
  {
    id: "adjacentFacetLuminance",
    label: "Adjacent facet luminance",
    kind: "number",
  },
  {
    id: "callerRequiredMichelsonContrast",
    label: "Caller required michelson contrast",
    kind: "number",
  },
  {
    id: "measuredLineWidthMicrometers",
    label: "Measured line width micrometers",
    kind: "number",
  },
  {
    id: "callerResolvableWidthMicrometers",
    label: "Caller resolvable width micrometers",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerResolvableWidthMicrometers,
    "callerResolvableWidthMicrometers",
  );
  nonnegative(input.polishLineLuminance, "polishLineLuminance");
  nonnegative(input.adjacentFacetLuminance, "adjacentFacetLuminance");
  nonnegative(
    input.measuredLineWidthMicrometers,
    "measuredLineWidthMicrometers",
  );
  fraction(
    input.callerRequiredMichelsonContrast,
    "callerRequiredMichelsonContrast",
  );
  const observedLineMichelsonContrast =
    Math.abs(input.polishLineLuminance - input.adjacentFacetLuminance) /
    positive(
      input.polishLineLuminance + input.adjacentFacetLuminance,
      "luminanceSum",
    );
  return {
    observedLineMichelsonContrast,
    meetsCallerContrastAndWidthCriterion:
      observedLineMichelsonContrast >= input.callerRequiredMichelsonContrast &&
      input.measuredLineWidthMicrometers >=
        input.callerResolvableWidthMicrometers,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  polishLineLuminance: 2,
  adjacentFacetLuminance: 10,
  callerRequiredMichelsonContrast: 0.5,
  measuredLineWidthMicrometers: 10,
  callerResolvableWidthMicrometers: 5,
} satisfies Input;
export const exampleOutput = {
  observedLineMichelsonContrast: 0.6666666666666666,
  meetsCallerContrastAndWidthCriterion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/polish-line-visibility",
  title: "Facet Polish Line Visibility Rater",
  description:
    "Audit measured polish-line contrast and instrument-resolvable width simultaneously under caller thresholds; not spatial RMS contrast or universal observer/commercial polish grade.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLineMichelsonContrast",
      label: "Observed line michelson contrast",
      kind: "number",
    },
    {
      id: "meetsCallerContrastAndWidthCriterion",
      label: "Meets caller contrast and width criterion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      polishLineLuminance: value.polishLineLuminance as number,
      adjacentFacetLuminance: value.adjacentFacetLuminance as number,
      callerRequiredMichelsonContrast:
        value.callerRequiredMichelsonContrast as number,
      measuredLineWidthMicrometers:
        value.measuredLineWidthMicrometers as number,
      callerResolvableWidthMicrometers:
        value.callerResolvableWidthMicrometers as number,
    }),
});
export const run = tool.execute;
export default tool;
