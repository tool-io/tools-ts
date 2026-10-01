import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly nextStart: number;
  readonly nextEnd: number;
};
export type Output = {
  readonly firstDuration: number;
  readonly nextDuration: number;
  readonly onsetInterval: number;
  readonly restInterval: number;
  readonly overlap: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "number" },
    firstEnd: { type: "number" },
    nextStart: { type: "number" },
    nextEnd: { type: "number" },
  },
  required: ["firstStart", "firstEnd", "nextStart", "nextEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstDuration: { type: "number" },
    nextDuration: { type: "number" },
    onsetInterval: { type: "number" },
    restInterval: { type: "number" },
    overlap: { type: "boolean" },
  },
  required: [
    "firstDuration",
    "nextDuration",
    "onsetInterval",
    "restInterval",
    "overlap",
  ],
} as const;
/** Report diary episode durations, onset spacing and signed rest gap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, nextStart, nextEnd } = request;
  const compute = (): Output => {
    H.domain(
      firstEnd >= firstStart && nextStart >= firstStart && nextEnd >= nextStart,
      "nextStart",
    );
    return {
      firstDuration: firstEnd - firstStart,
      nextDuration: nextEnd - nextStart,
      onsetInterval: nextStart - firstStart,
      restInterval: nextStart - firstEnd,
      overlap: nextStart < firstEnd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 0, firstEnd: 45, nextStart: 180, nextEnd: 230 },
  output: {
    firstDuration: 45,
    nextDuration: 50,
    onsetInterval: 180,
    restInterval: 135,
    overlap: false,
  },
} satisfies ToolExample<Input, Output>;
export const maternityDiaryContractionIntervalTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "obstetrics/maternity-diary-contraction-interval-term",
      title: "Maternity Diary Contraction Interval Term Tool",
      description:
        "Report diary episode durations, onset spacing and signed rest gap.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstStart: { type: "number" },
          firstEnd: { type: "number" },
          nextStart: { type: "number" },
          nextEnd: { type: "number" },
        },
        required: ["firstStart", "firstEnd", "nextStart", "nextEnd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstDuration: { type: "number" },
          nextDuration: { type: "number" },
          onsetInterval: { type: "number" },
          restInterval: { type: "number" },
          overlap: { type: "boolean" },
        },
        required: [
          "firstDuration",
          "nextDuration",
          "onsetInterval",
          "restInterval",
          "overlap",
        ],
      },
      ports: {
        inputs: [
          {
            id: "firstStart",
            label: "First Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstEnd",
            label: "First End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nextStart",
            label: "Next Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nextEnd",
            label: "Next End",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstDuration",
            label: "First Duration",
            valueType: { type: "number" },
          },
          {
            id: "nextDuration",
            label: "Next Duration",
            valueType: { type: "number" },
          },
          {
            id: "onsetInterval",
            label: "Onset Interval",
            valueType: { type: "number" },
          },
          {
            id: "restInterval",
            label: "Rest Interval",
            valueType: { type: "number" },
          },
          { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = maternityDiaryContractionIntervalTermTool.execute;
export default maternityDiaryContractionIntervalTermTool;
