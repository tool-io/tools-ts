import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly computedMainSizePx: number;
  readonly mainSizeIsAuto: boolean;
  readonly independentlyMeasuredContentBasisPx: number;
}>;
export type Output = Readonly<{ readonly resolvedAutoFlexBasisPx: number }>;
const inputFields = [
  { id: "computedMainSizePx", label: "Computed main size px", kind: "number" },
  { id: "mainSizeIsAuto", label: "Main size is auto", kind: "boolean" },
  {
    id: "independentlyMeasuredContentBasisPx",
    label: "Independently measured content basis px",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.computedMainSizePx, "computedMainSizePx");
  nonnegative(
    input.independentlyMeasuredContentBasisPx,
    "independentlyMeasuredContentBasisPx",
  );
  return {
    resolvedAutoFlexBasisPx: input.mainSizeIsAuto
      ? input.independentlyMeasuredContentBasisPx
      : input.computedMainSizePx,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  computedMainSizePx: 100,
  mainSizeIsAuto: false,
  independentlyMeasuredContentBasisPx: 50,
} satisfies Input;
export const exampleOutput = { resolvedAutoFlexBasisPx: 100 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/flex-basis-auto-content-size-note",
  title: "flex-basis:auto Content Size Note",
  description:
    "Resolve flex-basis:auto from independently computed main-size property; auto main size uses independently obtained content basis. Not intrinsic size measurement or min-size freezing. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "resolvedAutoFlexBasisPx",
      label: "Resolved auto flex basis px",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      computedMainSizePx: value.computedMainSizePx as number,
      mainSizeIsAuto: value.mainSizeIsAuto as boolean,
      independentlyMeasuredContentBasisPx:
        value.independentlyMeasuredContentBasisPx as number,
    }),
});
export const run = tool.execute;
export default tool;
