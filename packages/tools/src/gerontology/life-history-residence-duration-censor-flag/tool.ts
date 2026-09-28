import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly moveInDay: number;
  readonly moveOutDay: number;
  readonly interviewDay: number;
  readonly ongoing: boolean;
};
export type Output = {
  readonly endDay: number;
  readonly residenceDays: number;
  readonly rightCensored: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    moveInDay: { type: "integer" },
    moveOutDay: { type: "integer" },
    interviewDay: { type: "integer" },
    ongoing: { type: "boolean" },
  },
  required: ["moveInDay", "moveOutDay", "interviewDay", "ongoing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    endDay: { type: "integer" },
    residenceDays: { type: "integer" },
    rightCensored: { type: "boolean" },
  },
  required: ["endDay", "residenceDays", "rightCensored"],
} as const;
/** Calculate life history residence duration censor flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { moveInDay, moveOutDay, interviewDay, ongoing } = request;
  const compute = (): Output => {
    H.domain(
      interviewDay >= moveInDay &&
        (ongoing || (moveOutDay >= moveInDay && moveOutDay <= interviewDay)),
    );
    return {
      endDay: ongoing ? interviewDay : moveOutDay,
      residenceDays: (ongoing ? interviewDay : moveOutDay) - moveInDay,
      rightCensored: ongoing,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { moveInDay: 100, moveOutDay: 0, interviewDay: 500, ongoing: true },
  output: { endDay: 500, residenceDays: 400, rightCensored: true },
} satisfies ToolExample<Input, Output>;
export const lifeHistoryResidenceDurationCensorFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/life-history-residence-duration-censor-flag",
      title: "Life History Residence Duration Censor Flag Tool",
      description:
        "Calculate life history residence duration censor flag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          moveInDay: { type: "integer" },
          moveOutDay: { type: "integer" },
          interviewDay: { type: "integer" },
          ongoing: { type: "boolean" },
        },
        required: ["moveInDay", "moveOutDay", "interviewDay", "ongoing"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          endDay: { type: "integer" },
          residenceDays: { type: "integer" },
          rightCensored: { type: "boolean" },
        },
        required: ["endDay", "residenceDays", "rightCensored"],
      },
      ports: {
        inputs: [
          {
            id: "moveInDay",
            label: "Move In Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "moveOutDay",
            label: "Move Out Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "interviewDay",
            label: "Interview Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "ongoing",
            label: "Ongoing",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "endDay", label: "End Day", valueType: { type: "integer" } },
          {
            id: "residenceDays",
            label: "Residence Days",
            valueType: { type: "integer" },
          },
          {
            id: "rightCensored",
            label: "Right Censored",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = lifeHistoryResidenceDurationCensorFlagTool.execute;
export default lifeHistoryResidenceDurationCensorFlagTool;
