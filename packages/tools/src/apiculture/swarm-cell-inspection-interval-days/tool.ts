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
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedCellAgesDays: readonly number[];
  readonly earliestModelCappingAgeDays: number;
  readonly inspectionLeadDays: number;
  readonly currentVisitIntervalDays: number;
}>;
export type Output = Readonly<{
  readonly maximumModelInspectionIntervalDays: number;
  readonly visitIntervalMarginDays: number;
}>;
const inputFields = [
  {
    id: "observedCellAgesDays",
    label: "Observed cell ages days",
    kind: "numberList",
  },
  {
    id: "earliestModelCappingAgeDays",
    label: "Earliest model capping age days",
    kind: "number",
  },
  { id: "inspectionLeadDays", label: "Inspection lead days", kind: "number" },
  {
    id: "currentVisitIntervalDays",
    label: "Current visit interval days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.earliestModelCappingAgeDays, "earliestModelCappingAgeDays");
  input.observedCellAgesDays.forEach((v) =>
    nonnegative(v, "observedCellAgesDays"),
  );
  nonnegative(input.inspectionLeadDays, "inspectionLeadDays");
  nonnegative(input.currentVisitIntervalDays, "currentVisitIntervalDays");
  const remaining =
    input.earliestModelCappingAgeDays -
    maximum(input.observedCellAgesDays) -
    input.inspectionLeadDays;
  if (remaining < 0)
    simpleError(
      "observedCellAgesDays",
      "Model intervention lead window has already passed.",
    );
  return {
    maximumModelInspectionIntervalDays: remaining,
    visitIntervalMarginDays: remaining - input.currentVisitIntervalDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCellAgesDays: [2, 4],
  earliestModelCappingAgeDays: 8,
  inspectionLeadDays: 1,
  currentVisitIntervalDays: 4,
} satisfies Input;
export const exampleOutput = {
  maximumModelInspectionIntervalDays: 3,
  visitIntervalMarginDays: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/swarm-cell-inspection-interval-days",
  title: "Swarm Cell Inspection Interval Days",
  description:
    "Screen a visit interval against the oldest observed queen-cell age and caller earliest-capping/lead assumptions; does not predict swarming or prescribe an inspection interval.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumModelInspectionIntervalDays",
      label: "Maximum model inspection interval days",
      kind: "number",
    },
    {
      id: "visitIntervalMarginDays",
      label: "Visit interval margin days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCellAgesDays: value.observedCellAgesDays as readonly number[],
      earliestModelCappingAgeDays: value.earliestModelCappingAgeDays as number,
      inspectionLeadDays: value.inspectionLeadDays as number,
      currentVisitIntervalDays: value.currentVisitIntervalDays as number,
    }),
});
export const run = tool.execute;
export default tool;
