import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EpactDayMoonLookupInput = {
  readonly goldenNumber: number;
};

export type EpactDayMoonLookupOutput = {
  readonly epact: number;
  readonly epactDisplay: string;
  readonly daysUntilMeanNewMoon: number;
};

export const calculateEpactDayMoonLookup = (
  input: EpactDayMoonLookupInput,
): EpactDayMoonLookupOutput => {
  if (!(
    Number.isSafeInteger(input.goldenNumber) &&
    input.goldenNumber >= 1 &&
    input.goldenNumber <= 19
  ))
    return simpleError(
      "goldenNumber",
      "Golden number must be an integer from 1 to 19.",
      "invalid_golden_number",
    );
  const epact = (11 * (input.goldenNumber - 1)) % 30;
  return {
    epact,
    epactDisplay: epact === 0 ? "30" : String(epact),
    daysUntilMeanNewMoon: (30 - epact) % 30,
  };
};

export const epactDayMoonLookupExample = {
  input: { goldenNumber: 11 },
  output: { epact: 20, epactDisplay: "20", daysUntilMeanNewMoon: 10 },
} satisfies ToolExample<EpactDayMoonLookupInput, EpactDayMoonLookupOutput>;

export const epactDayMoonLookupTool = createSimpleTool({
  id: "paleography/epact-day-moon-lookup",
  title: "Epact Day Moon Lookup",
  description:
    "Look up the Julian computus epact = 11 x (golden number - 1) mod 30, i.e. the conventional age in days of the mean moon on 1 January, displayed as 30 when the residue is zero.",
  inputs: [
    {
      description:
        "Golden number of the year (from paleography/golden-number-cycle-position).",
      id: "goldenNumber",
      kind: "integer",
      label: "Golden number",
      maximum: 19,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Epact value 0-29.",
      id: "epact",
      kind: "integer",
      label: "Epact",
      maximum: 29,
      minimum: 0,
    },
    {
      description: "Liturgical display form; zero is written 30.",
      id: "epactDisplay",
      kind: "string",
      label: "Display form",
    },
    {
      description: "Days until the next mean new moon under the same model.",
      id: "daysUntilMeanNewMoon",
      kind: "integer",
      label: "Days to new moon",
      maximum: 29,
      minimum: 0,
    },
  ],
  calculate: (input) =>
    calculateEpactDayMoonLookup({ goldenNumber: input.goldenNumber as number }),
});

export const runEpactDayMoonLookup = epactDayMoonLookupTool.execute;
export default epactDayMoonLookupTool;
