import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PersonYearsExposedRiskComputationInput = {
  readonly entryTimes: readonly number[];
  readonly exitTimes: readonly number[];
  readonly eventsCount?: number;
};

export type PersonYearsExposedRiskComputationOutput = {
  readonly totalPersonYears: number;
  readonly meanPersonYearsPerPerson: number;
  readonly incidenceRatePerThousandPersonYears: number;
};

export const calculatePersonYearsExposedRiskComputation = (
  input: PersonYearsExposedRiskComputationInput,
): PersonYearsExposedRiskComputationOutput => {
  if (input.entryTimes.length === 0)
    simpleError(
      "entryTimes",
      "Provide at least one exposure spell.",
      "invalid_list",
    );
  if (input.exitTimes.length !== input.entryTimes.length)
    simpleError(
      "exitTimes",
      "Entry and exit lists must have one exit per entry.",
      "invalid_list",
    );
  let totalPersonYears = 0;
  for (let i = 0; i < input.entryTimes.length; i += 1) {
    const entry = input.entryTimes[i]!;
    const exit = input.exitTimes[i]!;
    if (!(typeof entry === "number" && Number.isFinite(entry)))
      simpleError(
        "entryTimes",
        "Entry times must be finite numbers.",
        "invalid_list",
      );
    if (!(typeof exit === "number" && Number.isFinite(exit)))
      simpleError(
        "exitTimes",
        "Exit times must be finite numbers.",
        "invalid_list",
      );
    if (exit < entry)
      simpleError(
        "exitTimes",
        "Each exit time must not precede its entry time.",
        "invalid_list",
      );
    totalPersonYears += exit - entry;
  }
  if (!(totalPersonYears > 0))
    simpleError(
      "exitTimes",
      "Total exposure must be greater than zero.",
      "invalid_list",
    );
  const eventsCount = input.eventsCount ?? 0;
  if (!(Number.isSafeInteger(eventsCount) && eventsCount >= 0))
    simpleError(
      "eventsCount",
      "Event count must be a non-negative integer.",
      "invalid_events",
    );
  return {
    totalPersonYears,
    meanPersonYearsPerPerson: totalPersonYears / input.entryTimes.length,
    incidenceRatePerThousandPersonYears:
      (eventsCount / totalPersonYears) * 1000,
  };
};

export const personYearsExposedRiskComputationExample = {
  input: { entryTimes: [0, 0, 0], exitTimes: [2, 3, 5], eventsCount: 1 },
  output: {
    totalPersonYears: 10,
    meanPersonYearsPerPerson: 3.3333333333333335,
    incidenceRatePerThousandPersonYears: 100,
  },
} satisfies ToolExample<
  PersonYearsExposedRiskComputationInput,
  PersonYearsExposedRiskComputationOutput
>;

export const personYearsExposedRiskComputationTool = createSimpleTool({
  id: "demography/person-years-exposed-risk-computation",
  title: "Person Years Exposed Risk Computation",
  description:
    "Sum exact exposure spells into total person-years lived at risk and convert an event count into the mean exposure per person and the incidence rate per thousand person-years.",
  inputs: [
    {
      description:
        "Entry time of each exposure spell in years on one common scale.",
      id: "entryTimes",
      kind: "numberList",
      label: "Entries",
    },
    {
      description:
        "Exit time of each spell (event or censoring); exits follow their entries.",
      id: "exitTimes",
      kind: "numberList",
      label: "Exits",
    },
    {
      default: 0,
      description: "Events observed during exposure; zero yields a null rate.",
      id: "eventsCount",
      kind: "integer",
      label: "Events",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Total person-years of exposure across all spells.",
      id: "totalPersonYears",
      kind: "number",
      label: "Person-years",
    },
    {
      description: "Mean person-years contributed per person.",
      id: "meanPersonYearsPerPerson",
      kind: "number",
      label: "Mean exposure",
    },
    {
      description:
        "Incidence rate expressed per thousand person-years of exposure.",
      id: "incidenceRatePerThousandPersonYears",
      kind: "number",
      label: "Rate per 1000 PY",
    },
  ],
  calculate: (input) =>
    calculatePersonYearsExposedRiskComputation(
      input as unknown as PersonYearsExposedRiskComputationInput,
    ),
});

export const runPersonYearsExposedRiskComputation =
  personYearsExposedRiskComputationTool.execute;
export default personYearsExposedRiskComputationTool;
