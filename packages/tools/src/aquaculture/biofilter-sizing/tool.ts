import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly tanLoadsKgNPerDay: readonly number[];
  readonly designPeakFactor: number;
  readonly arealRemovalGramsNPerM2Day: number;
  readonly operationalDeratingFraction: number;
}>;
export type Output = Readonly<{
  readonly designLoadKgNPerDay: number;
  readonly requiredActiveSurfaceAreaM2: number;
}>;
const inputFields = [
  {
    id: "tanLoadsKgNPerDay",
    label: "Tan loads kg n per day",
    kind: "numberList",
  },
  { id: "designPeakFactor", label: "Design peak factor", kind: "number" },
  {
    id: "arealRemovalGramsNPerM2Day",
    label: "Areal removal grams n per m2 day",
    kind: "number",
  },
  {
    id: "operationalDeratingFraction",
    label: "Operational derating fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.arealRemovalGramsNPerM2Day, "arealRemovalGramsNPerM2Day");
  positive(input.operationalDeratingFraction, "operationalDeratingFraction");
  input.tanLoadsKgNPerDay.forEach((v) => nonnegative(v, "tanLoadsKgNPerDay"));
  fraction(input.operationalDeratingFraction, "operationalDeratingFraction");
  if (!input.tanLoadsKgNPerDay.length || input.designPeakFactor < 1)
    simpleError(
      "designPeakFactor",
      "Nonempty loads and peak factor at least one required.",
    );
  const designLoadKgNPerDay =
    input.tanLoadsKgNPerDay.reduce((a, b) => a + b, 0) * input.designPeakFactor;
  return {
    designLoadKgNPerDay,
    requiredActiveSurfaceAreaM2:
      (1000 * designLoadKgNPerDay) /
      (input.arealRemovalGramsNPerM2Day * input.operationalDeratingFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  tanLoadsKgNPerDay: [1, 2],
  designPeakFactor: 1.5,
  arealRemovalGramsNPerM2Day: 0.5,
  operationalDeratingFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  designLoadKgNPerDay: 4.5,
  requiredActiveSurfaceAreaM2: 11250,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/biofilter-sizing",
  title: "Biofilter Sizing",
  description:
    "Size active nitrifying surface against combined TAN loads with supplied peak/rate/derating assumptions; no media rating, startup guarantee or fish safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "designLoadKgNPerDay",
      label: "Design load kg n per day",
      kind: "number",
    },
    {
      id: "requiredActiveSurfaceAreaM2",
      label: "Required active surface area m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      tanLoadsKgNPerDay: value.tanLoadsKgNPerDay as readonly number[],
      designPeakFactor: value.designPeakFactor as number,
      arealRemovalGramsNPerM2Day: value.arealRemovalGramsNPerM2Day as number,
      operationalDeratingFraction: value.operationalDeratingFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
