import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly groundWidthM: number;
  readonly groundHeightM: number;
  readonly usablePaperWidthMm: number;
  readonly usablePaperHeightMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "groundWidthM", label: "Ground width m", kind: "number" },
  { id: "groundHeightM", label: "Ground height m", kind: "number" },
  { id: "usablePaperWidthMm", label: "Usable paper width mm", kind: "number" },
  {
    id: "usablePaperHeightMm",
    label: "Usable paper height mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  [
    i.groundWidthM,
    i.groundHeightM,
    i.usablePaperWidthMm,
    i.usablePaperHeightMm,
  ].forEach((v) => positive(v, "dimensions"));
  return {
    minimumFitDenominator: Math.max(
      (1000 * i.groundWidthM) / i.usablePaperWidthMm,
      (1000 * i.groundHeightM) / i.usablePaperHeightMm,
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    groundWidthM: 1000,
    groundHeightM: 2000,
    usablePaperWidthMm: 100,
    usablePaperHeightMm: 100,
  },
  output: { result: { minimumFitDenominator: 20000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/best-fit-scale-finder-paper",
  title: "Best Fit Scale for Paper Size Finder",
  description:
    "Minimum continuous denominator fitting projected extent to actual usable print dimensions, fixed orientation; no standard-scale rounding.",
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
