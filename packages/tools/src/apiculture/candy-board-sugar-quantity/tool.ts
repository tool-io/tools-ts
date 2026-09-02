import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedCandyBoardUsedVolumeCM3: number;
  readonly independentCandyBulkDensityGCM3: number;
  readonly independentCandySugarMassFraction: number;
}>;
export type Output = Readonly<{ readonly conditionalBoardSugarMassG: number }>;
const inputFields = [
  {
    id: "observedCandyBoardUsedVolumeCM3",
    label: "Observed candy board used volume c m3",
    kind: "number",
  },
  {
    id: "independentCandyBulkDensityGCM3",
    label: "Independent candy bulk density g c m3",
    kind: "number",
  },
  {
    id: "independentCandySugarMassFraction",
    label: "Independent candy sugar mass fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentCandyBulkDensityGCM3,
    "independentCandyBulkDensityGCM3",
  );
  nonnegative(
    input.observedCandyBoardUsedVolumeCM3,
    "observedCandyBoardUsedVolumeCM3",
  );
  fraction(
    input.independentCandySugarMassFraction,
    "independentCandySugarMassFraction",
  );
  return {
    conditionalBoardSugarMassG:
      input.observedCandyBoardUsedVolumeCM3 *
      input.independentCandyBulkDensityGCM3 *
      input.independentCandySugarMassFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCandyBoardUsedVolumeCM3: 1000,
  independentCandyBulkDensityGCM3: 0.8,
  independentCandySugarMassFraction: 0.9,
} satisfies Input;
export const exampleOutput = {
  conditionalBoardSugarMassG: 720,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/candy-board-sugar-quantity",
  title: "Candy Board Sugar Quantity Calculator",
  description:
    "Actual candy-board occupied volume and independently measured prepared-candy density/sugar assay, not feed recipe or winter colony requirement. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalBoardSugarMassG",
      label: "Conditional board sugar mass g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCandyBoardUsedVolumeCM3:
        value.observedCandyBoardUsedVolumeCM3 as number,
      independentCandyBulkDensityGCM3:
        value.independentCandyBulkDensityGCM3 as number,
      independentCandySugarMassFraction:
        value.independentCandySugarMassFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
