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
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly fallbackLineCounts: readonly number[];
  readonly webfontLineCounts: readonly number[];
  readonly fallbackLineHeightsPx: readonly number[];
  readonly webfontLineHeightsPx: readonly number[];
  readonly measuredFollowingBlockWidthsPx: readonly number[];
  readonly viewportWidthPx: number;
  readonly viewportHeightPx: number;
}>;
export type Output = Readonly<{
  readonly signedFollowingBlockDisplacementsPx: readonly number[];
  readonly sumDisplacedAreaOverViewportArea: number;
  readonly maximumAbsoluteFollowingDisplacementPx: number;
}>;
const inputFields = [
  {
    id: "fallbackLineCounts",
    label: "Fallback line counts",
    kind: "numberList",
  },
  { id: "webfontLineCounts", label: "Webfont line counts", kind: "numberList" },
  {
    id: "fallbackLineHeightsPx",
    label: "Fallback line heights px",
    kind: "numberList",
  },
  {
    id: "webfontLineHeightsPx",
    label: "Webfont line heights px",
    kind: "numberList",
  },
  {
    id: "measuredFollowingBlockWidthsPx",
    label: "Measured following block widths px",
    kind: "numberList",
  },
  { id: "viewportWidthPx", label: "Viewport width px", kind: "number" },
  { id: "viewportHeightPx", label: "Viewport height px", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.fallbackLineHeightsPx.forEach((v) =>
    positive(v, "fallbackLineHeightsPx"),
  );
  input.webfontLineHeightsPx.forEach((v) =>
    positive(v, "webfontLineHeightsPx"),
  );
  positive(input.viewportWidthPx, "viewportWidthPx");
  positive(input.viewportHeightPx, "viewportHeightPx");
  input.measuredFollowingBlockWidthsPx.forEach((v) =>
    nonnegative(v, "measuredFollowingBlockWidthsPx"),
  );
  input.fallbackLineCounts.forEach((v) => count(v, "fallbackLineCounts"));
  input.webfontLineCounts.forEach((v) => count(v, "webfontLineCounts"));
  aligned(
    input.fallbackLineCounts,
    input.webfontLineCounts,
    "fallbackLineCounts",
  );
  aligned(
    input.fallbackLineCounts,
    input.fallbackLineHeightsPx,
    "fallbackLineCounts",
  );
  aligned(
    input.fallbackLineCounts,
    input.webfontLineHeightsPx,
    "fallbackLineCounts",
  );
  aligned(
    input.fallbackLineCounts,
    input.measuredFollowingBlockWidthsPx,
    "fallbackLineCounts",
  );
  if (
    input.measuredFollowingBlockWidthsPx.some((v) => v > input.viewportWidthPx)
  )
    simpleError(
      "widths",
      "Observed block widths cannot exceed this viewport model.",
    );
  const d = input.webfontLineCounts.map(
    (v, i) =>
      v * input.webfontLineHeightsPx[i] -
      input.fallbackLineCounts[i] * input.fallbackLineHeightsPx[i],
  );
  return {
    signedFollowingBlockDisplacementsPx: d,
    sumDisplacedAreaOverViewportArea:
      d.reduce(
        (s, v, i) => s + Math.abs(v) * input.measuredFollowingBlockWidthsPx[i],
        0,
      ) /
      (input.viewportWidthPx * input.viewportHeightPx),
    maximumAbsoluteFollowingDisplacementPx: Math.max(...d.map(Math.abs)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fallbackLineCounts: [2, 3],
  webfontLineCounts: [3, 2],
  fallbackLineHeightsPx: [20, 20],
  webfontLineHeightsPx: [22, 22],
  measuredFollowingBlockWidthsPx: [100, 200],
  viewportWidthPx: 500,
  viewportHeightPx: 500,
} satisfies Input;
export const exampleOutput = {
  signedFollowingBlockDisplacementsPx: [26, -16],
  sumDisplacedAreaOverViewportArea: 0.0232,
  maximumAbsoluteFollowingDisplacementPx: 26,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/fout-layout-shift-width-delta-checker",
  title: "FOUT Layout-Shift Width Delta Check",
  description:
    "Estimate following-block displacement from measured line reflow/line heights and sum declared displacement areas; not browser CLS impact/viewport clipping/session-window aggregation or duplicate text-width delta.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedFollowingBlockDisplacementsPx",
      label: "Signed following block displacements px",
      kind: "numberList",
    },
    {
      id: "sumDisplacedAreaOverViewportArea",
      label: "Sum displaced area over viewport area",
      kind: "number",
    },
    {
      id: "maximumAbsoluteFollowingDisplacementPx",
      label: "Maximum absolute following displacement px",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fallbackLineCounts: value.fallbackLineCounts as readonly number[],
      webfontLineCounts: value.webfontLineCounts as readonly number[],
      fallbackLineHeightsPx: value.fallbackLineHeightsPx as readonly number[],
      webfontLineHeightsPx: value.webfontLineHeightsPx as readonly number[],
      measuredFollowingBlockWidthsPx:
        value.measuredFollowingBlockWidthsPx as readonly number[],
      viewportWidthPx: value.viewportWidthPx as number,
      viewportHeightPx: value.viewportHeightPx as number,
    }),
});
export const run = tool.execute;
export default tool;
