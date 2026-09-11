import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedProcessedProductMass: number;
  readonly actualQualifiedWholeHarvestMass: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedProcessedProductMass",
    label: "Actual qualified processed product mass",
    kind: "number",
  },
  {
    id: "actualQualifiedWholeHarvestMass",
    label: "Actual qualified whole harvest mass",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualQualifiedProcessedProductMass,
    "actualQualifiedProcessedProductMass",
  );
  positive(
    input.actualQualifiedWholeHarvestMass,
    "actualQualifiedWholeHarvestMass",
  );
  if (
    input.actualQualifiedProcessedProductMass >
    input.actualQualifiedWholeHarvestMass
  )
    simpleError("mass", "Declaredsame-sourceprocessed≤wholeharvest.");
  return {
    value:
      (100 * input.actualQualifiedProcessedProductMass) /
      input.actualQualifiedWholeHarvestMass,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedProcessedProductMass: 2,
    actualQualifiedWholeHarvestMass: 4,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/processing-yield",
  title: "Processing Yield Calculator",
  description:
    "Actual processing mass recovery percentage product/whole harvest, no productionkg/hectare or food-safety/quality approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
