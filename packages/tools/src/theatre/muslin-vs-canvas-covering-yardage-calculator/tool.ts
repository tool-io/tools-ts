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
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly flatCoverWidthsM: readonly number[];
  readonly flatCoverHeightsM: readonly number[];
  readonly edgeAllowanceM: number;
  readonly muslinRollWidthM: number;
  readonly canvasRollWidthM: number;
}>;
export type Output = Readonly<{
  readonly muslinStripCounts: readonly number[];
  readonly canvasStripCounts: readonly number[];
  readonly muslinPurchaseLengthM: number;
  readonly canvasPurchaseLengthM: number;
}>;
const inputFields = [
  { id: "flatCoverWidthsM", label: "Flat cover widths m", kind: "numberList" },
  {
    id: "flatCoverHeightsM",
    label: "Flat cover heights m",
    kind: "numberList",
  },
  { id: "edgeAllowanceM", label: "Edge allowance m", kind: "number" },
  { id: "muslinRollWidthM", label: "Muslin roll width m", kind: "number" },
  { id: "canvasRollWidthM", label: "Canvas roll width m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.flatCoverWidthsM.forEach((v) => positive(v, "flatCoverWidthsM"));
  input.flatCoverHeightsM.forEach((v) => positive(v, "flatCoverHeightsM"));
  positive(input.muslinRollWidthM, "muslinRollWidthM");
  positive(input.canvasRollWidthM, "canvasRollWidthM");
  nonnegative(input.edgeAllowanceM, "edgeAllowanceM");
  aligned(input.flatCoverWidthsM, input.flatCoverHeightsM, "flatCoverWidthsM");
  if (input.flatCoverWidthsM.length > 128)
    simpleError("flats", "At most 128 independent flats required.");
  const strips = (roll: number) =>
      input.flatCoverWidthsM.map((w) =>
        integer(Math.ceil((w + 2 * input.edgeAllowanceM) / roll), "strips"),
      ),
    muslin = strips(input.muslinRollWidthM),
    canvas = strips(input.canvasRollWidthM),
    length = (counts: number[]) =>
      sum(
        counts.map(
          (v, i) => v * (input.flatCoverHeightsM[i] + 2 * input.edgeAllowanceM),
        ),
      );
  return {
    muslinStripCounts: muslin,
    canvasStripCounts: canvas,
    muslinPurchaseLengthM: length(muslin),
    canvasPurchaseLengthM: length(canvas),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  flatCoverWidthsM: [3, 2],
  flatCoverHeightsM: [2, 2],
  edgeAllowanceM: 0.1,
  muslinRollWidthM: 2,
  canvasRollWidthM: 1.5,
} satisfies Input;
export const exampleOutput = {
  muslinStripCounts: [2, 2],
  canvasStripCounts: [3, 2],
  muslinPurchaseLengthM: 8.8,
  canvasPurchaseLengthM: 11,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/muslin-vs-canvas-covering-yardage-calculator",
  title: "Muslin vs Canvas Covering Yardage Calculator",
  description:
    "Compare actual per-flat muslin/canvas roll-width cutting estimates using one-direction drops and caller edge allowance; no scrap reuse, seam overlap, stretch, strength or fire treatment assumed.",
  inputs: inputFields,
  outputs: [
    {
      id: "muslinStripCounts",
      label: "Muslin strip counts",
      kind: "numberList",
    },
    {
      id: "canvasStripCounts",
      label: "Canvas strip counts",
      kind: "numberList",
    },
    {
      id: "muslinPurchaseLengthM",
      label: "Muslin purchase length m",
      kind: "number",
    },
    {
      id: "canvasPurchaseLengthM",
      label: "Canvas purchase length m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      flatCoverWidthsM: value.flatCoverWidthsM as readonly number[],
      flatCoverHeightsM: value.flatCoverHeightsM as readonly number[],
      edgeAllowanceM: value.edgeAllowanceM as number,
      muslinRollWidthM: value.muslinRollWidthM as number,
      canvasRollWidthM: value.canvasRollWidthM as number,
    }),
});
export const run = tool.execute;
export default tool;
