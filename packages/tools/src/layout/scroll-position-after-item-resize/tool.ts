import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch53-shared.js";

export type Input = Readonly<{
  scrollPosition: number;
  oldItemExtent: number;
  newItemExtent: number;
  itemBeforeAnchor: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "scrollPosition", label: "Scroll position", kind: "number" },
  { id: "oldItemExtent", label: "Old item extent", kind: "number" },
  { id: "newItemExtent", label: "New item extent", kind: "number" },
  { id: "itemBeforeAnchor", label: "Item before anchor", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.scrollPosition, "scroll");
  nonnegative(i.oldItemExtent, "old");
  nonnegative(i.newItemExtent, "new");
  return {
    conditionalPosition:
      i.scrollPosition +
      (i.itemBeforeAnchor ? i.newItemExtent - i.oldItemExtent : 0),
    signedExtentChange: i.newItemExtent - i.oldItemExtent,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    scrollPosition: 20,
    oldItemExtent: 5,
    newItemExtent: 8,
    itemBeforeAnchor: true,
  },
  output: { result: { conditionalPosition: 23, signedExtentChange: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "layout/scroll-position-after-item-resize",
  title: "Scroll Position after Item Resize",
  description:
    "Adjust scroll position only when a resized item is independently established before the anchor; retain signed extent change and do not infer overlapping-anchor behavior.",
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
