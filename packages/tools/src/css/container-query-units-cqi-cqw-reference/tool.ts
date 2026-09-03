import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerEligibleContainerWidthPx: number;
  readonly callerEligibleContainerInlineSizePx: number;
  readonly observedPercent: number;
}>;
export type Output = Readonly<{
  readonly cqwLengthPx: number;
  readonly cqiLengthPx: number;
}>;
const inputFields = [
  {
    id: "callerEligibleContainerWidthPx",
    label: "Caller eligible container width px",
    kind: "number",
  },
  {
    id: "callerEligibleContainerInlineSizePx",
    label: "Caller eligible container inline size px",
    kind: "number",
  },
  { id: "observedPercent", label: "Observed percent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerEligibleContainerWidthPx,
    "callerEligibleContainerWidthPx",
  );
  nonnegative(
    input.callerEligibleContainerInlineSizePx,
    "callerEligibleContainerInlineSizePx",
  );
  nonnegative(input.observedPercent, "observedPercent");
  return {
    cqwLengthPx:
      (input.callerEligibleContainerWidthPx * input.observedPercent) / 100,
    cqiLengthPx:
      (input.callerEligibleContainerInlineSizePx * input.observedPercent) / 100,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEligibleContainerWidthPx: 400,
  callerEligibleContainerInlineSizePx: 200,
  observedPercent: 10,
} satisfies Input;
export const exampleOutput = {
  cqwLengthPx: 40,
  cqiLengthPx: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/container-query-units-cqi-cqw-reference",
  title: "Container Query Units cqi/cqw Reference",
  description:
    "Resolve cqw vs cqi with independently selected eligible query-container sizes, writing-mode inline size distinct from physical width; no ancestor/container selection or fallback inference. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "cqwLengthPx", label: "Cqw length px", kind: "number" },
    { id: "cqiLengthPx", label: "Cqi length px", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerEligibleContainerWidthPx:
        value.callerEligibleContainerWidthPx as number,
      callerEligibleContainerInlineSizePx:
        value.callerEligibleContainerInlineSizePx as number,
      observedPercent: value.observedPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
