import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly contourOrdinalIndices: readonly number[];
  readonly everyNth: number;
  readonly originOrdinal: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "contourOrdinalIndices",
    label: "Contour ordinal indices",
    kind: "numberList",
  },
  { id: "everyNth", label: "Every nth", kind: "number" },
  { id: "originOrdinal", label: "Origin ordinal", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  bounded(i.everyNth, "nth", 1, 1000000);
  bounded(i.originOrdinal, "origin", -1000000, 1000000);
  i.contourOrdinalIndices.forEach((v) =>
    bounded(v, "ordinal", -1000000, 1000000),
  );
  return {
    indexContourOrdinals: i.contourOrdinalIndices.filter(
      (v) => (v - i.originOrdinal) % i.everyNth === 0,
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    contourOrdinalIndices: [0, 1, 2, 3, 4, 5],
    everyNth: 2,
    originOrdinal: 0,
  },
  output: { result: { indexContourOrdinals: [0, 2, 4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/index-contour-every-nth-selector",
  title: "Index Contour Every Nth Selector Calculator",
  description:
    "Select every Nth contour ordinal aligned to caller origin, including signed below-datum indices; no elevation rounding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
