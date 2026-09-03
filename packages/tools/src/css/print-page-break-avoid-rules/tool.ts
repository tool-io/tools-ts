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
  nonnegative,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedBlockHeightPx: number;
  readonly remainingPageHeightPx: number;
  readonly fullPageHeightPx: number;
  readonly avoidInsideRequested: boolean;
}>;
export type Output = Readonly<{
  readonly avoidCanFitOnFreshPage: boolean;
  readonly conditionalMoveToNextPage: boolean;
}>;
const inputFields = [
  {
    id: "observedBlockHeightPx",
    label: "Observed block height px",
    kind: "number",
  },
  {
    id: "remainingPageHeightPx",
    label: "Remaining page height px",
    kind: "number",
  },
  { id: "fullPageHeightPx", label: "Full page height px", kind: "number" },
  {
    id: "avoidInsideRequested",
    label: "Avoid inside requested",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.fullPageHeightPx, "fullPageHeightPx");
  nonnegative(input.observedBlockHeightPx, "observedBlockHeightPx");
  nonnegative(input.remainingPageHeightPx, "remainingPageHeightPx");
  if (input.remainingPageHeightPx > input.fullPageHeightPx)
    simpleError("page", "Remaining≤fullpage.");
  const fits = input.observedBlockHeightPx <= input.fullPageHeightPx;
  return {
    avoidCanFitOnFreshPage: fits,
    conditionalMoveToNextPage:
      input.avoidInsideRequested &&
      fits &&
      input.observedBlockHeightPx > input.remainingPageHeightPx,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBlockHeightPx: 120,
  remainingPageHeightPx: 100,
  fullPageHeightPx: 200,
  avoidInsideRequested: true,
} satisfies Input;
export const exampleOutput = {
  avoidCanFitOnFreshPage: true,
  conditionalMoveToNextPage: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/print-page-break-avoid-rules",
  title: "Print Page-Break Avoid Rules",
  description:
    "Conditional print-fragmentation fit screen for explicit break-inside avoidance; oversized content may require breaking, not guarantee printer pagination. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "avoidCanFitOnFreshPage",
      label: "Avoid can fit on fresh page",
      kind: "boolean",
    },
    {
      id: "conditionalMoveToNextPage",
      label: "Conditional move to next page",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBlockHeightPx: value.observedBlockHeightPx as number,
      remainingPageHeightPx: value.remainingPageHeightPx as number,
      fullPageHeightPx: value.fullPageHeightPx as number,
      avoidInsideRequested: value.avoidInsideRequested as boolean,
    }),
});
export const run = tool.execute;
export default tool;
