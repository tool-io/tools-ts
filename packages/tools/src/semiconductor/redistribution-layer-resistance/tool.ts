import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedRdlSectionLengthsM: readonly number[];
  readonly observedRdlSectionWidthsM: readonly number[];
  readonly callerMeasuredRdlSheetOhms: readonly number[];
  readonly observedIndependentRdlViaOhms: readonly number[];
}>;
export type Output = Readonly<{
  readonly sectionRdlResistanceOhms: readonly number[];
  readonly totalMeasuredRdlPathOhms: number;
}>;
const inputFields = [
  {
    id: "observedRdlSectionLengthsM",
    label: "Observed rdl section lengths m",
    kind: "numberList",
  },
  {
    id: "observedRdlSectionWidthsM",
    label: "Observed rdl section widths m",
    kind: "numberList",
  },
  {
    id: "callerMeasuredRdlSheetOhms",
    label: "Caller measured rdl sheet ohms",
    kind: "numberList",
  },
  {
    id: "observedIndependentRdlViaOhms",
    label: "Observed independent rdl via ohms",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRdlSectionWidthsM.forEach((v) =>
    positive(v, "observedRdlSectionWidthsM"),
  );
  input.observedRdlSectionLengthsM.forEach((v) =>
    nonnegative(v, "observedRdlSectionLengthsM"),
  );
  input.callerMeasuredRdlSheetOhms.forEach((v) =>
    nonnegative(v, "callerMeasuredRdlSheetOhms"),
  );
  input.observedIndependentRdlViaOhms.forEach((v) =>
    nonnegative(v, "observedIndependentRdlViaOhms"),
  );
  aligned(
    input.observedRdlSectionLengthsM,
    input.observedRdlSectionWidthsM,
    "observedRdlSectionLengthsM",
  );
  aligned(
    input.observedRdlSectionLengthsM,
    input.callerMeasuredRdlSheetOhms,
    "observedRdlSectionLengthsM",
  );
  const sections = input.observedRdlSectionLengthsM.map(
    (v, i) =>
      (v / input.observedRdlSectionWidthsM[i]) *
      input.callerMeasuredRdlSheetOhms[i],
  );
  return {
    sectionRdlResistanceOhms: sections,
    totalMeasuredRdlPathOhms: sum([
      ...sections,
      ...input.observedIndependentRdlViaOhms,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRdlSectionLengthsM: [1, 2],
  observedRdlSectionWidthsM: [1, 2],
  callerMeasuredRdlSheetOhms: [2, 3],
  observedIndependentRdlViaOhms: [0.5],
} satisfies Input;
export const exampleOutput = {
  sectionRdlResistanceOhms: [2, 3],
  totalMeasuredRdlPathOhms: 5.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/redistribution-layer-resistance",
  title: "Semiconductor Redistribution Layer Resistance Calculator",
  description:
    "Budget actual variable-width RDL sections using independently measured sheet resistance and via series inventory, not uniform copper resistivity path formula.",
  inputs: inputFields,
  outputs: [
    {
      id: "sectionRdlResistanceOhms",
      label: "Section rdl resistance ohms",
      kind: "numberList",
    },
    {
      id: "totalMeasuredRdlPathOhms",
      label: "Total measured rdl path ohms",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRdlSectionLengthsM:
        value.observedRdlSectionLengthsM as readonly number[],
      observedRdlSectionWidthsM:
        value.observedRdlSectionWidthsM as readonly number[],
      callerMeasuredRdlSheetOhms:
        value.callerMeasuredRdlSheetOhms as readonly number[],
      observedIndependentRdlViaOhms:
        value.observedIndependentRdlViaOhms as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
