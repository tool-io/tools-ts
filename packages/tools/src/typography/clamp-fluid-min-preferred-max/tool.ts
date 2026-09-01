import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, cssNumber } from "../shared.js";
export type Input = Readonly<{
  readonly minimumFontPx: number;
  readonly maximumFontPx: number;
  readonly minimumViewportPx: number;
  readonly maximumViewportPx: number;
  readonly rootFontPx: number;
}>;
export type Output = Readonly<{
  readonly cssClampExpression: string;
  readonly preferredVwCoefficient: number;
  readonly preferredInterceptRem: number;
}>;
const inputFields = [
  { id: "minimumFontPx", label: "Minimum font px", kind: "number" },
  { id: "maximumFontPx", label: "Maximum font px", kind: "number" },
  { id: "minimumViewportPx", label: "Minimum viewport px", kind: "number" },
  { id: "maximumViewportPx", label: "Maximum viewport px", kind: "number" },
  { id: "rootFontPx", label: "Root font px", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.minimumFontPx, "minimumFontPx");
  positive(input.maximumFontPx, "maximumFontPx");
  positive(input.minimumViewportPx, "minimumViewportPx");
  positive(input.maximumViewportPx, "maximumViewportPx");
  positive(input.rootFontPx, "rootFontPx");
  if (
    input.maximumViewportPx <= input.minimumViewportPx ||
    input.maximumFontPx < input.minimumFontPx
  )
    simpleError(
      "bounds",
      "Increasing viewport and nondecreasing font endpoints required.",
    );
  const slope =
      (input.maximumFontPx - input.minimumFontPx) /
      (input.maximumViewportPx - input.minimumViewportPx),
    intercept =
      (input.minimumFontPx - slope * input.minimumViewportPx) /
      input.rootFontPx;
  return {
    cssClampExpression: `clamp(${cssNumber(input.minimumFontPx / input.rootFontPx)}rem, ${cssNumber(intercept)}rem + ${cssNumber(100 * slope)}vw, ${cssNumber(input.maximumFontPx / input.rootFontPx)}rem)`,
    preferredVwCoefficient: 100 * slope,
    preferredInterceptRem: intercept,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  minimumFontPx: 16,
  maximumFontPx: 24,
  minimumViewportPx: 400,
  maximumViewportPx: 800,
  rootFontPx: 16,
} satisfies Input;
export const exampleOutput = {
  cssClampExpression: "clamp(1rem, 0.5rem + 2vw, 1.5rem)",
  preferredVwCoefficient: 2,
  preferredInterceptRem: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/clamp-fluid-min-preferred-max",
  title: "CSS clamp() Min/Preferred/Max Builder",
  description:
    "Build bounded fluid CSS typography clamp from caller font/viewport endpoints and rem root; root changes affect rem representation, no universal breakpoints or accessibility certification.",
  inputs: inputFields,
  outputs: [
    { id: "cssClampExpression", label: "Css clamp expression", kind: "string" },
    {
      id: "preferredVwCoefficient",
      label: "Preferred vw coefficient",
      kind: "number",
    },
    {
      id: "preferredInterceptRem",
      label: "Preferred intercept rem",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      minimumFontPx: value.minimumFontPx as number,
      maximumFontPx: value.maximumFontPx as number,
      minimumViewportPx: value.minimumViewportPx as number,
      maximumViewportPx: value.maximumViewportPx as number,
      rootFontPx: value.rootFontPx as number,
    }),
});
export const run = tool.execute;
export default tool;
