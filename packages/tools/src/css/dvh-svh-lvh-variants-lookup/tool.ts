import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly smallViewportHeightPx: number;
  readonly largeViewportHeightPx: number;
  readonly dynamicViewportHeightPx: number;
  readonly observedPercent: number;
}>;
export type Output = Readonly<{
  readonly svhLengthPx: number;
  readonly lvhLengthPx: number;
  readonly dvhLengthPx: number;
}>;
const inputFields = [
  {
    id: "smallViewportHeightPx",
    label: "Small viewport height px",
    kind: "number",
  },
  {
    id: "largeViewportHeightPx",
    label: "Large viewport height px",
    kind: "number",
  },
  {
    id: "dynamicViewportHeightPx",
    label: "Dynamic viewport height px",
    kind: "number",
  },
  { id: "observedPercent", label: "Observed percent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.smallViewportHeightPx, "smallViewportHeightPx");
  nonnegative(input.largeViewportHeightPx, "largeViewportHeightPx");
  nonnegative(input.dynamicViewportHeightPx, "dynamicViewportHeightPx");
  nonnegative(input.observedPercent, "observedPercent");
  ordered(input.smallViewportHeightPx, input.dynamicViewportHeightPx);
  ordered(input.dynamicViewportHeightPx, input.largeViewportHeightPx);
  return {
    svhLengthPx: (input.smallViewportHeightPx * input.observedPercent) / 100,
    lvhLengthPx: (input.largeViewportHeightPx * input.observedPercent) / 100,
    dvhLengthPx: (input.dynamicViewportHeightPx * input.observedPercent) / 100,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  smallViewportHeightPx: 600,
  largeViewportHeightPx: 800,
  dynamicViewportHeightPx: 700,
  observedPercent: 50,
} satisfies Input;
export const exampleOutput = {
  svhLengthPx: 300,
  lvhLengthPx: 400,
  dvhLengthPx: 350,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/dvh-svh-lvh-variants-lookup",
  title: "dvh/svh/lvh Viewport Variants Lookup",
  description:
    "Explicit independently observed small/large/dynamic viewport sizes, units are percentages of corresponding heights; no inferred browser chrome or vh alias. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    { id: "svhLengthPx", label: "Svh length px", kind: "number" },
    { id: "lvhLengthPx", label: "Lvh length px", kind: "number" },
    { id: "dvhLengthPx", label: "Dvh length px", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      smallViewportHeightPx: value.smallViewportHeightPx as number,
      largeViewportHeightPx: value.largeViewportHeightPx as number,
      dynamicViewportHeightPx: value.dynamicViewportHeightPx as number,
      observedPercent: value.observedPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
