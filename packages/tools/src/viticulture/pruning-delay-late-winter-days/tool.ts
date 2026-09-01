import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, dateDay } from "../batch34-shared.js";
export type Input = Readonly<{
  readonly callerReferencePruningCivilDate: string;
  readonly observedPruningCivilDate: string;
  readonly callerLatestPermittedPruningCivilDate: string;
  readonly independentlyObservedBudGrowthPresent: boolean;
}>;
export type Output = Readonly<{
  readonly signedPruningDelayCalendarDays: number;
  readonly signedDaysUntilCallerLatestPruning: number;
  readonly observedPruningAfterCallerLatestDate: boolean;
  readonly budGrowthEvidenceRequiresCallerReview: boolean;
}>;
const inputFields = [
  {
    id: "callerReferencePruningCivilDate",
    label: "Caller reference pruning civil date",
    kind: "string",
  },
  {
    id: "observedPruningCivilDate",
    label: "Observed pruning civil date",
    kind: "string",
  },
  {
    id: "callerLatestPermittedPruningCivilDate",
    label: "Caller latest permitted pruning civil date",
    kind: "string",
  },
  {
    id: "independentlyObservedBudGrowthPresent",
    label: "Independently observed bud growth present",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const reference = dateDay(input.callerReferencePruningCivilDate),
    actual = dateDay(input.observedPruningCivilDate),
    latest = dateDay(input.callerLatestPermittedPruningCivilDate);
  if (latest < reference)
    simpleError("window", "Caller latest date precedes reference.");
  return {
    signedPruningDelayCalendarDays: actual - reference,
    signedDaysUntilCallerLatestPruning: latest - actual,
    observedPruningAfterCallerLatestDate: actual > latest,
    budGrowthEvidenceRequiresCallerReview:
      input.independentlyObservedBudGrowthPresent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerReferencePruningCivilDate: "2026-02-01",
  observedPruningCivilDate: "2026-02-15",
  callerLatestPermittedPruningCivilDate: "2026-02-20",
  independentlyObservedBudGrowthPresent: true,
} satisfies Input;
export const exampleOutput = {
  signedPruningDelayCalendarDays: 14,
  signedDaysUntilCallerLatestPruning: 5,
  observedPruningAfterCallerLatestDate: false,
  budGrowthEvidenceRequiresCallerReview: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/pruning-delay-late-winter-days",
  title: "Pruning Delay Late Winter Days Calculator",
  description:
    "Audit actual pruning delay/calendar-window and independent bud-growth evidence, retaining signed early/late timing; no recommendation to delay pruning, frost protection or physiological readiness.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedPruningDelayCalendarDays",
      label: "Signed pruning delay calendar days",
      kind: "number",
    },
    {
      id: "signedDaysUntilCallerLatestPruning",
      label: "Signed days until caller latest pruning",
      kind: "number",
    },
    {
      id: "observedPruningAfterCallerLatestDate",
      label: "Observed pruning after caller latest date",
      kind: "boolean",
    },
    {
      id: "budGrowthEvidenceRequiresCallerReview",
      label: "Bud growth evidence requires caller review",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerReferencePruningCivilDate:
        value.callerReferencePruningCivilDate as string,
      observedPruningCivilDate: value.observedPruningCivilDate as string,
      callerLatestPermittedPruningCivilDate:
        value.callerLatestPermittedPruningCivilDate as string,
      independentlyObservedBudGrowthPresent:
        value.independentlyObservedBudGrowthPresent as boolean,
    }),
});
export const run = tool.execute;
export default tool;
