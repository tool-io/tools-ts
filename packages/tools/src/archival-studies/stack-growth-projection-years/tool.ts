import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly currentOccupiedExtentM: number;
  readonly usableStackExtentM: number;
  readonly annualAccessionGrowthM: number;
  readonly annualPlannedDisposalExtentM: number;
  readonly maximumProjectionYears: number;
}>;
export type Output = Readonly<{
  readonly projectedNetAnnualGrowthM: number;
  readonly capacityReachedWithinHorizon: boolean;
  readonly firstWholeYearAtOrAboveCapacity: number;
  readonly projectedOccupiedExtentAtHorizonM: number;
}>;
const inputFields = [
  {
    id: "currentOccupiedExtentM",
    label: "Current occupied extent m",
    kind: "number",
  },
  { id: "usableStackExtentM", label: "Usable stack extent m", kind: "number" },
  {
    id: "annualAccessionGrowthM",
    label: "Annual accession growth m",
    kind: "number",
  },
  {
    id: "annualPlannedDisposalExtentM",
    label: "Annual planned disposal extent m",
    kind: "number",
  },
  {
    id: "maximumProjectionYears",
    label: "Maximum projection years",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.currentOccupiedExtentM, "currentOccupiedExtentM");
  nonnegative(input.usableStackExtentM, "usableStackExtentM");
  nonnegative(input.annualAccessionGrowthM, "annualAccessionGrowthM");
  nonnegative(
    input.annualPlannedDisposalExtentM,
    "annualPlannedDisposalExtentM",
  );
  count(input.maximumProjectionYears, "maximumProjectionYears");
  const g = input.annualAccessionGrowthM - input.annualPlannedDisposalExtentM,
    h = input.currentOccupiedExtentM + g * input.maximumProjectionYears;
  if (h < 0)
    simpleError(
      "projection",
      "Declared constant disposal cannot drive inventory negative in horizon.",
    );
  const yr =
    input.currentOccupiedExtentM >= input.usableStackExtentM
      ? 0
      : g > 0
        ? safeCeil(
            (input.usableStackExtentM - input.currentOccupiedExtentM) / g,
            "year",
          )
        : -1;
  return {
    projectedNetAnnualGrowthM: g,
    capacityReachedWithinHorizon:
      yr !== -1 && yr <= input.maximumProjectionYears,
    firstWholeYearAtOrAboveCapacity:
      yr !== -1 && yr <= input.maximumProjectionYears ? yr : -1,
    projectedOccupiedExtentAtHorizonM: h,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  currentOccupiedExtentM: 50,
  usableStackExtentM: 100,
  annualAccessionGrowthM: 10,
  annualPlannedDisposalExtentM: 2,
  maximumProjectionYears: 10,
} satisfies Input;
export const exampleOutput = {
  projectedNetAnnualGrowthM: 8,
  capacityReachedWithinHorizon: true,
  firstWholeYearAtOrAboveCapacity: 7,
  projectedOccupiedExtentAtHorizonM: 130,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/stack-growth-projection-years",
  title: "Stack Range Growth Projection Years Calculator",
  description:
    "Project caller constant accession-minus-disposal stack extent with explicit finite horizon and no-capacity-event sentinel; negative growth is retained, not presumed lawful disposal or validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "projectedNetAnnualGrowthM",
      label: "Projected net annual growth m",
      kind: "number",
    },
    {
      id: "capacityReachedWithinHorizon",
      label: "Capacity reached within horizon",
      kind: "boolean",
    },
    {
      id: "firstWholeYearAtOrAboveCapacity",
      label: "First whole year at or above capacity",
      kind: "number",
    },
    {
      id: "projectedOccupiedExtentAtHorizonM",
      label: "Projected occupied extent at horizon m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      currentOccupiedExtentM: value.currentOccupiedExtentM as number,
      usableStackExtentM: value.usableStackExtentM as number,
      annualAccessionGrowthM: value.annualAccessionGrowthM as number,
      annualPlannedDisposalExtentM:
        value.annualPlannedDisposalExtentM as number,
      maximumProjectionYears: value.maximumProjectionYears as number,
    }),
});
export const run = tool.execute;
export default tool;
