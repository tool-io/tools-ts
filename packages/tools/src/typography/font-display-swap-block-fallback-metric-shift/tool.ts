import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly fallbackMeasuredTextWidthsPx: readonly number[];
  readonly webfontMeasuredTextWidthsPx: readonly number[];
  readonly fontSwapAtSeconds: number;
  readonly callerBlockWindowSeconds: number;
  readonly callerSwapWindowSeconds: number;
}>;
export type Output = Readonly<{
  readonly signedPostSwapWidthChangesPx: readonly number[];
  readonly fontArrivedInBlockWindow: boolean;
  readonly fontArrivedBeforeSwapWindowEnd: boolean;
  readonly visibleFallbackSwapExpectedUnderPolicy: boolean;
}>;
const inputFields = [
  {
    id: "fallbackMeasuredTextWidthsPx",
    label: "Fallback measured text widths px",
    kind: "numberList",
  },
  {
    id: "webfontMeasuredTextWidthsPx",
    label: "Webfont measured text widths px",
    kind: "numberList",
  },
  { id: "fontSwapAtSeconds", label: "Font swap at seconds", kind: "number" },
  {
    id: "callerBlockWindowSeconds",
    label: "Caller block window seconds",
    kind: "number",
  },
  {
    id: "callerSwapWindowSeconds",
    label: "Caller swap window seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.fallbackMeasuredTextWidthsPx.forEach((v) =>
    nonnegative(v, "fallbackMeasuredTextWidthsPx"),
  );
  input.webfontMeasuredTextWidthsPx.forEach((v) =>
    nonnegative(v, "webfontMeasuredTextWidthsPx"),
  );
  nonnegative(input.fontSwapAtSeconds, "fontSwapAtSeconds");
  nonnegative(input.callerBlockWindowSeconds, "callerBlockWindowSeconds");
  nonnegative(input.callerSwapWindowSeconds, "callerSwapWindowSeconds");
  aligned(
    input.fallbackMeasuredTextWidthsPx,
    input.webfontMeasuredTextWidthsPx,
    "fallbackMeasuredTextWidthsPx",
  );
  const block = input.fontSwapAtSeconds <= input.callerBlockWindowSeconds,
    before =
      input.fontSwapAtSeconds <=
      input.callerBlockWindowSeconds + input.callerSwapWindowSeconds;
  return {
    signedPostSwapWidthChangesPx: input.webfontMeasuredTextWidthsPx.map(
      (v, i) => v - input.fallbackMeasuredTextWidthsPx[i],
    ),
    fontArrivedInBlockWindow: block,
    fontArrivedBeforeSwapWindowEnd: before,
    visibleFallbackSwapExpectedUnderPolicy: !block && before,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fallbackMeasuredTextWidthsPx: [100, 200],
  webfontMeasuredTextWidthsPx: [110, 180],
  fontSwapAtSeconds: 2,
  callerBlockWindowSeconds: 3,
  callerSwapWindowSeconds: 2,
} satisfies Input;
export const exampleOutput = {
  signedPostSwapWidthChangesPx: [10, -20],
  fontArrivedInBlockWindow: true,
  fontArrivedBeforeSwapWindowEnd: true,
  visibleFallbackSwapExpectedUnderPolicy: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/font-display-swap-block-fallback-metric-shift",
  title: "font-display Swap Block Fallback Shift Metric",
  description:
    "Audit measured fallback/webfont width differences and arrival against caller display block/swap windows; modeled visibility only, not a browser-timing guarantee or a real CLS score.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedPostSwapWidthChangesPx",
      label: "Signed post swap width changes px",
      kind: "numberList",
    },
    {
      id: "fontArrivedInBlockWindow",
      label: "Font arrived in block window",
      kind: "boolean",
    },
    {
      id: "fontArrivedBeforeSwapWindowEnd",
      label: "Font arrived before swap window end",
      kind: "boolean",
    },
    {
      id: "visibleFallbackSwapExpectedUnderPolicy",
      label: "Visible fallback swap expected under policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      fallbackMeasuredTextWidthsPx:
        value.fallbackMeasuredTextWidthsPx as readonly number[],
      webfontMeasuredTextWidthsPx:
        value.webfontMeasuredTextWidthsPx as readonly number[],
      fontSwapAtSeconds: value.fontSwapAtSeconds as number,
      callerBlockWindowSeconds: value.callerBlockWindowSeconds as number,
      callerSwapWindowSeconds: value.callerSwapWindowSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
