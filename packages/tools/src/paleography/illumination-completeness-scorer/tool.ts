import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IlluminationCompletenessScorerInput = {
  readonly plannedInitials: number;
  readonly executedInitials: number;
  readonly plannedMiniatures?: number;
  readonly executedMiniatures?: number;
};

export type IlluminationCompletenessScorerOutput = {
  readonly overallCompletenessPercent: number;
  readonly initialsPercent: number;
  readonly miniaturesPercent: number;
  readonly statusBand:
    "barely_begun" | "partly_executed" | "largely_complete" | "complete";
};

const checkPair = (planned: number, executed: number, field: string): void => {
  if (!(Number.isSafeInteger(planned) && planned >= 0))
    simpleError(
      field.replace("executed", "planned").replace("Executed", "Planned"),
      "Planned counts must be non-negative integers.",
      "invalid_count",
    );
  if (!(Number.isSafeInteger(executed) && executed >= 0 && executed <= planned))
    simpleError(
      field,
      "Executed counts must be integers between 0 and the planned count.",
      "invalid_count",
    );
};

export const calculateIlluminationCompletenessScorer = (
  input: IlluminationCompletenessScorerInput,
): IlluminationCompletenessScorerOutput => {
  checkPair(input.plannedInitials, input.executedInitials, "executedInitials");
  const plannedMiniatures = input.plannedMiniatures ?? 0;
  const executedMiniatures = input.executedMiniatures ?? 0;
  checkPair(plannedMiniatures, executedMiniatures, "executedMiniatures");
  const totalPlanned = input.plannedInitials + plannedMiniatures;
  if (!Number.isSafeInteger(totalPlanned) || totalPlanned <= 0)
    simpleError(
      "plannedInitials",
      "Plan at least one initial or miniature to score completeness.",
      "invalid_count",
    );
  const initialsPercent =
    input.plannedInitials === 0
      ? 100
      : (input.executedInitials / input.plannedInitials) * 100;
  const miniaturesPercent =
    plannedMiniatures === 0
      ? 100
      : (executedMiniatures / plannedMiniatures) * 100;
  const overallCompletenessPercent =
    ((input.executedInitials + executedMiniatures) / totalPlanned) * 100;
  return {
    overallCompletenessPercent,
    initialsPercent,
    miniaturesPercent,
    statusBand:
      overallCompletenessPercent === 100
        ? "complete"
        : overallCompletenessPercent >= 75
          ? "largely_complete"
          : overallCompletenessPercent >= 25
            ? "partly_executed"
            : "barely_begun",
  };
};

export const illuminationCompletenessScorerExample = {
  input: {
    plannedInitials: 20,
    executedInitials: 16,
    plannedMiniatures: 4,
    executedMiniatures: 3,
  },
  output: {
    overallCompletenessPercent: 79.16666666666666,
    initialsPercent: 80,
    miniaturesPercent: 75,
    statusBand: "largely_complete",
  },
} satisfies ToolExample<
  IlluminationCompletenessScorerInput,
  IlluminationCompletenessScorerOutput
>;

export const illuminationCompletenessScorerTool = createSimpleTool({
  id: "paleography/illumination-completeness-scorer",
  title: "Illumination Completeness Scorer",
  description:
    "Score how much of a planned illumination programme was executed: exact percentages for initials and miniatures (a category with nothing planned counts as 100%) and an overall band at the stated cut-offs (complete 100%, largely complete 75-99%, partly executed 25-74%, barely begun below 25%).",
  inputs: [
    {
      description: "Initials planned in the programme.",
      id: "plannedInitials",
      kind: "integer",
      label: "Planned initials",
      minimum: 0,
    },
    {
      description: "Initials actually executed.",
      id: "executedInitials",
      kind: "integer",
      label: "Executed initials",
      minimum: 0,
    },
    {
      default: 0,
      description: "Miniatures or large images planned.",
      id: "plannedMiniatures",
      kind: "integer",
      label: "Planned miniatures",
      minimum: 0,
    },
    {
      default: 0,
      description: "Miniatures actually executed.",
      id: "executedMiniatures",
      kind: "integer",
      label: "Executed miniatures",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "All executed elements as a percentage of all planned elements.",
      id: "overallCompletenessPercent",
      kind: "number",
      label: "Overall %",
    },
    {
      description: "Executed initials percentage (100 when none planned).",
      id: "initialsPercent",
      kind: "number",
      label: "Initials %",
    },
    {
      description: "Executed miniatures percentage (100 when none planned).",
      id: "miniaturesPercent",
      kind: "number",
      label: "Miniatures %",
    },
    {
      description: "Status band from the stated cut-offs.",
      id: "statusBand",
      enum: ["barely_begun", "partly_executed", "largely_complete", "complete"],
      kind: "string",
      label: "Status band",
    },
  ],
  calculate: (input) =>
    calculateIlluminationCompletenessScorer({
      executedInitials: input.executedInitials as number,
      executedMiniatures: input.executedMiniatures as number,
      plannedInitials: input.plannedInitials as number,
      plannedMiniatures: input.plannedMiniatures as number,
    }),
});

export const runIlluminationCompletenessScorer =
  illuminationCompletenessScorerTool.execute;
export default illuminationCompletenessScorerTool;
