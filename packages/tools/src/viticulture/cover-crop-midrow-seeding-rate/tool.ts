import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly blockHectares: number;
  readonly rowSpacingM: number;
  readonly seededStripWidthM: number;
  readonly seedKgPerSeededHectare: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "blockHectares", label: "Block hectares", kind: "number" },
  { id: "rowSpacingM", label: "Row spacing m", kind: "number" },
  { id: "seededStripWidthM", label: "Seeded strip width m", kind: "number" },
  {
    id: "seedKgPerSeededHectare",
    label: "Seed kg per seeded hectare",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.blockHectares, "area");
  positive(i.rowSpacingM, "spacing");
  nonnegative(i.seededStripWidthM, "strip");
  nonnegative(i.seedKgPerSeededHectare, "rate");
  if (i.seededStripWidthM > i.rowSpacingM)
    simpleError("strip", "Strip cannot exceed row spacing.");
  return {
    seedKg:
      ((i.blockHectares * i.seededStripWidthM) / i.rowSpacingM) *
      i.seedKgPerSeededHectare,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    blockHectares: 2,
    rowSpacingM: 2,
    seededStripWidthM: 0.5,
    seedKgPerSeededHectare: 40,
  },
  output: { result: { seedKg: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/cover-crop-midrow-seeding-rate",
  title: "Cover Crop Midrow Seeding Rate Calculator",
  description:
    "Seed inventory adjusted for actually seeded midrow strips rather than whole vineyard area.",
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
