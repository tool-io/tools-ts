import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../shared.js";
export type Input = Readonly<{
  readonly harvestCalendarYear: number;
  readonly firstEstablishedCalendarYear: number;
  readonly establishmentObserved: boolean;
  readonly lastSurveyCalendarYear: number;
}>;
export type Output = Readonly<{
  readonly observedOrCensoredDelayYears: number;
  readonly isRightCensored: boolean;
}>;
const inputFields = [
  { id: "harvestCalendarYear", label: "Harvest calendar year", kind: "number" },
  {
    id: "firstEstablishedCalendarYear",
    label: "First established calendar year",
    kind: "number",
  },
  {
    id: "establishmentObserved",
    label: "Establishment observed",
    kind: "boolean",
  },
  {
    id: "lastSurveyCalendarYear",
    label: "Last survey calendar year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.lastSurveyCalendarYear < input.harvestCalendarYear ||
    (input.establishmentObserved &&
      (input.firstEstablishedCalendarYear < input.harvestCalendarYear ||
        input.firstEstablishedCalendarYear > input.lastSurveyCalendarYear))
  )
    simpleError(
      "years",
      "Ordered harvest/survey and bracketed observed establishment year required.",
    );
  return {
    observedOrCensoredDelayYears:
      (input.establishmentObserved
        ? input.firstEstablishedCalendarYear
        : input.lastSurveyCalendarYear) - input.harvestCalendarYear,
    isRightCensored: !input.establishmentObserved,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  harvestCalendarYear: 2000,
  firstEstablishedCalendarYear: 2005,
  establishmentObserved: true,
  lastSurveyCalendarYear: 2010,
} satisfies Input;
export const exampleOutput = {
  observedOrCensoredDelayYears: 5,
  isRightCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/regeneration-delay-year-counter",
  title: "Regeneration Delay Year Counter",
  description:
    "Count observed establishment delay or right-censored time since harvest at last survey, explicitly preserving nondetection; supplied unused establishment year is not treated as an event when unobserved.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedOrCensoredDelayYears",
      label: "Observed or censored delay years",
      kind: "number",
    },
    { id: "isRightCensored", label: "Is right censored", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      harvestCalendarYear: value.harvestCalendarYear as number,
      firstEstablishedCalendarYear:
        value.firstEstablishedCalendarYear as number,
      establishmentObserved: value.establishmentObserved as boolean,
      lastSurveyCalendarYear: value.lastSurveyCalendarYear as number,
    }),
});
export const run = tool.execute;
export default tool;
