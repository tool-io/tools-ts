import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly areaM2: number;
  readonly rowSpacingM: number;
  readonly plantSpacingM: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "areaM2", label: "Area m2", kind: "number" },
  { id: "rowSpacingM", label: "Row spacing m", kind: "number" },
  { id: "plantSpacingM", label: "Plant spacing m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.areaM2, "area");
  positive(i.rowSpacingM, "rows");
  positive(i.plantSpacingM, "plants");
  return {
    continuousPlantCapacity: i.areaM2 / (i.rowSpacingM * i.plantSpacingM),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { areaM2: 100, rowSpacingM: 2, plantSpacingM: 1 },
  output: { result: { continuousPlantCapacity: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/plant-spacing-mulberry-row",
  title: "Plant Spacing Mulberry Row Calculator",
  description:
    "Continuous mulberry rectangular-grid planting capacity before edge/aisle exclusions; not integer survey layout.",
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
