import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, fraction, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly totalPlannedSlots: number;
  readonly alreadyScheduledEvergreen: number;
  readonly alreadyScheduledSpot: number;
  readonly callerMinimumEvergreenFraction: number;
}>;
export type Output = Readonly<{
  readonly unscheduledSlots: number;
  readonly minimumTotalEvergreenSlots: number;
  readonly additionalEvergreenSlotsRequired: number;
  readonly targetFeasibleWithoutRescheduling: boolean;
}>;
const inputFields = [
  { id: "totalPlannedSlots", label: "Total planned slots", kind: "number" },
  {
    id: "alreadyScheduledEvergreen",
    label: "Already scheduled evergreen",
    kind: "number",
  },
  {
    id: "alreadyScheduledSpot",
    label: "Already scheduled spot",
    kind: "number",
  },
  {
    id: "callerMinimumEvergreenFraction",
    label: "Caller minimum evergreen fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.totalPlannedSlots, "slots", 0, 1000000);
  bounded(
    input.alreadyScheduledEvergreen,
    "evergreen",
    0,
    input.totalPlannedSlots,
  );
  bounded(input.alreadyScheduledSpot, "spot", 0, input.totalPlannedSlots);
  fraction(input.callerMinimumEvergreenFraction, "target");
  const left =
    input.totalPlannedSlots -
    input.alreadyScheduledEvergreen -
    input.alreadyScheduledSpot;
  if (left < 0)
    simpleError("schedule", "Scheduled slots exceed plan capacity.");
  const minimum = Math.ceil(
      input.totalPlannedSlots * input.callerMinimumEvergreenFraction,
    ),
    needed = Math.max(0, minimum - input.alreadyScheduledEvergreen);
  return {
    unscheduledSlots: left,
    minimumTotalEvergreenSlots: minimum,
    additionalEvergreenSlotsRequired: needed,
    targetFeasibleWithoutRescheduling: needed <= left,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalPlannedSlots: 10,
  alreadyScheduledEvergreen: 2,
  alreadyScheduledSpot: 3,
  callerMinimumEvergreenFraction: 0.6,
} satisfies Input;
export const exampleOutput = {
  unscheduledSlots: 5,
  minimumTotalEvergreenSlots: 6,
  additionalEvergreenSlotsRequired: 4,
  targetFeasibleWithoutRescheduling: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/evergreen-vs-spot-content-ratio-planner",
  title: "Evergreen vs Spot Content Ratio Planner",
  description:
    "Plan remaining editorial evergreen/spot slots against caller minimum mix while preserving already scheduled commitments and infeasible target; not content-quality judgment or a universal ideal evergreen proportion.",
  inputs: inputFields,
  outputs: [
    { id: "unscheduledSlots", label: "Unscheduled slots", kind: "number" },
    {
      id: "minimumTotalEvergreenSlots",
      label: "Minimum total evergreen slots",
      kind: "number",
    },
    {
      id: "additionalEvergreenSlotsRequired",
      label: "Additional evergreen slots required",
      kind: "number",
    },
    {
      id: "targetFeasibleWithoutRescheduling",
      label: "Target feasible without rescheduling",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      totalPlannedSlots: value.totalPlannedSlots as number,
      alreadyScheduledEvergreen: value.alreadyScheduledEvergreen as number,
      alreadyScheduledSpot: value.alreadyScheduledSpot as number,
      callerMinimumEvergreenFraction:
        value.callerMinimumEvergreenFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
