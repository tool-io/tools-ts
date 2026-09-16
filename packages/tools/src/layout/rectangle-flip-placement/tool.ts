import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  rectangle,
} from "../batch53-shared.js";

export type Input = Readonly<{
  anchor: readonly number[];
  viewport: readonly number[];
  popupWidth: number;
  popupHeight: number;
  gap: number;
  preferredSide: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "anchor", label: "Anchor", kind: "numberList" },
  { id: "viewport", label: "Viewport", kind: "numberList" },
  { id: "popupWidth", label: "Popup width", kind: "number" },
  { id: "popupHeight", label: "Popup height", kind: "number" },
  { id: "gap", label: "Gap", kind: "number" },
  { id: "preferredSide", label: "Preferred side", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  rectangle(i.anchor);
  rectangle(i.viewport);
  nonnegative(i.popupWidth, "width");
  nonnegative(i.popupHeight, "height");
  nonnegative(i.gap, "gap");
  if (!["left", "right", "top", "bottom"].includes(i.preferredSide))
    simpleError("side", "Four physical sides.");
  const place = (side: string): number[] => {
    const [x, y, w, h] = i.anchor;
    return side === "left"
      ? [x - i.gap - i.popupWidth, y, i.popupWidth, i.popupHeight]
      : side === "right"
        ? [x + w + i.gap, y, i.popupWidth, i.popupHeight]
        : side === "top"
          ? [x, y - i.gap - i.popupHeight, i.popupWidth, i.popupHeight]
          : [x, y + h + i.gap, i.popupWidth, i.popupHeight];
  };
  const fits = (r: number[]) =>
      r[0] >= i.viewport[0] &&
      r[1] >= i.viewport[1] &&
      r[0] + r[2] <= i.viewport[0] + i.viewport[2] &&
      r[1] + r[3] <= i.viewport[1] + i.viewport[3],
    opposite = (
      { left: "right", right: "left", top: "bottom", bottom: "top" } as Record<
        string,
        string
      >
    )[i.preferredSide];
  let side = i.preferredSide,
    r = place(side);
  if (!fits(r) && fits(place(opposite))) {
    side = opposite;
    r = place(side);
  }
  return { side, rectangle: r, fits: fits(r) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    anchor: [8, 4, 1, 1],
    viewport: [0, 0, 10, 10],
    popupWidth: 3,
    popupHeight: 2,
    gap: 0,
    preferredSide: "right",
  },
  output: { result: { side: "left", rectangle: [5, 4, 3, 2], fits: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/rectangle-flip-placement",
  title: "Rectangle Flip Placement",
  description:
    "Plan a preferred axis-aligned popup placement or its opposite when only the latter fully fits; no orthogonal shifting or CSS/DOM layout inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
