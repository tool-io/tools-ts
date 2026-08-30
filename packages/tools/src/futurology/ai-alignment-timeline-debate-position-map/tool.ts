import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AiAlignmentTimelineInput = {
  readonly positionLabels: ReadonlyArray<string>;
  readonly positionYears: ReadonlyArray<number>;
};

export type AiAlignmentTimelineOutput = {
  readonly earliestPositionYear: number;
  readonly latestPositionYear: number;
  readonly meanPositionYear: number;
  readonly timelineEntries: ReadonlyArray<string>;
};

export const mapAiAlignmentTimelineDebate = (
  input: AiAlignmentTimelineInput,
): AiAlignmentTimelineOutput => {
  if (
    !Array.isArray(input.positionYears) ||
    !Array.isArray(input.positionLabels)
  )
    simpleError(
      "",
      "Position years and labels must be arrays.",
      "alignment_position_data_required",
    );
  if (
    input.positionYears.length === 0 ||
    input.positionYears.length !== input.positionLabels.length
  )
    simpleError(
      "positionLabels",
      "Each position must have one year and one label.",
      "alignment_position_length_mismatch",
    );
  const positions = input.positionYears.map((year, index) => {
    if (!Number.isFinite(year) || year < 0)
      simpleError(
        `positionYears.${index}`,
        "Position years must be finite and nonnegative.",
        "invalid_position_year",
      );
    const label = input.positionLabels[index];
    if (typeof label !== "string" || label.trim() === "")
      simpleError(
        `positionLabels.${index}`,
        "Position labels must be nonempty strings.",
        "invalid_position_label",
      );
    return { label: label.trim(), year };
  });
  if (
    new Set(positions.map((position) => position.label)).size !==
    positions.length
  )
    simpleError(
      "positionLabels",
      "Position labels must be unique.",
      "duplicate_position_label",
    );
  const sortedPositions = [...positions].sort(
    (first, second) => first.year - second.year,
  );
  const meanPositionYear =
    positions.reduce((total, position) => total + position.year, 0) /
    positions.length;
  return {
    earliestPositionYear: sortedPositions[0]!.year,
    latestPositionYear: sortedPositions[sortedPositions.length - 1]!.year,
    meanPositionYear,
    timelineEntries: sortedPositions.map(
      (position) => `${position.year}: ${position.label}`,
    ),
  };
};

export const aiAlignmentTimelineExample = {
  input: {
    positionLabels: ["Near-term systems", "Long-term systems"],
    positionYears: [2045, 2030],
  },
  output: {
    earliestPositionYear: 2030,
    latestPositionYear: 2045,
    meanPositionYear: 2037.5,
    timelineEntries: ["2030: Long-term systems", "2045: Near-term systems"],
  },
} satisfies ToolExample<AiAlignmentTimelineInput, AiAlignmentTimelineOutput>;

export const aiAlignmentTimelineTool = createSimpleTool({
  calculate: (input) =>
    mapAiAlignmentTimelineDebate({
      positionLabels: input.positionLabels as string[],
      positionYears: input.positionYears as number[],
    }),
  description:
    "Sort caller-supplied AI-alignment debate positions by year and report the earliest, latest, and mean positions.",
  id: "futurology/ai-alignment-timeline-debate-position-map",
  inputs: [
    { id: "positionLabels", kind: "stringList", label: "Position labels" },
    { id: "positionYears", kind: "numberList", label: "Position years" },
  ],
  outputs: [
    {
      id: "earliestPositionYear",
      kind: "number",
      label: "Earliest position year",
      minimum: 0,
    },
    {
      id: "latestPositionYear",
      kind: "number",
      label: "Latest position year",
      minimum: 0,
    },
    {
      id: "meanPositionYear",
      kind: "number",
      label: "Mean position year",
      minimum: 0,
    },
    { id: "timelineEntries", kind: "stringList", label: "Timeline entries" },
  ],
  title: "AI Alignment Timeline Debate Position Map",
});

export const runAiAlignmentTimeline = aiAlignmentTimelineTool.execute;
export default aiAlignmentTimelineTool;
