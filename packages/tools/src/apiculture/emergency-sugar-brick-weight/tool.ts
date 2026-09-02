import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
  sum,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedPreparedBrickGrossMassG: readonly number[];
  readonly observedPackagingTaresG: readonly number[];
  readonly independentSugarAssayFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly netPreparedBrickMassesG: readonly number[];
  readonly assayedTotalSugarG: number;
}>;
const inputFields = [
  {
    id: "observedPreparedBrickGrossMassG",
    label: "Observed prepared brick gross mass g",
    kind: "numberList",
  },
  {
    id: "observedPackagingTaresG",
    label: "Observed packaging tares g",
    kind: "numberList",
  },
  {
    id: "independentSugarAssayFractions",
    label: "Independent sugar assay fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPreparedBrickGrossMassG.forEach((v) =>
    nonnegative(v, "observedPreparedBrickGrossMassG"),
  );
  input.observedPackagingTaresG.forEach((v) =>
    nonnegative(v, "observedPackagingTaresG"),
  );
  input.independentSugarAssayFractions.forEach((v) =>
    fraction(v, "independentSugarAssayFractions"),
  );
  aligned(
    input.observedPreparedBrickGrossMassG,
    input.observedPackagingTaresG,
    "observedPreparedBrickGrossMassG",
  );
  aligned(
    input.observedPreparedBrickGrossMassG,
    input.independentSugarAssayFractions,
    "observedPreparedBrickGrossMassG",
  );
  const net = input.observedPreparedBrickGrossMassG.map((v, i) =>
    nonnegative(v - input.observedPackagingTaresG[i], "net brick"),
  );
  return {
    netPreparedBrickMassesG: net,
    assayedTotalSugarG: sum(
      net.map((v, i) => v * input.independentSugarAssayFractions[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPreparedBrickGrossMassG: [500, 400],
  observedPackagingTaresG: [20, 10],
  independentSugarAssayFractions: [0.9, 0.8],
} satisfies Input;
export const exampleOutput = {
  netPreparedBrickMassesG: [480, 390],
  assayedTotalSugarG: 744,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/emergency-sugar-brick-weight",
  title: "Emergency Sugar Brick Weight Calculator",
  description:
    "Actual already-prepared emergency brick net and assayed sugar inventory, not recipe/inferred emergency feeding need. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "netPreparedBrickMassesG",
      label: "Net prepared brick masses g",
      kind: "numberList",
    },
    {
      id: "assayedTotalSugarG",
      label: "Assayed total sugar g",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPreparedBrickGrossMassG:
        value.observedPreparedBrickGrossMassG as readonly number[],
      observedPackagingTaresG:
        value.observedPackagingTaresG as readonly number[],
      independentSugarAssayFractions:
        value.independentSugarAssayFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
