import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sheetWidth: number;
  readonly sheetLength: number;
  readonly beats: number;
  readonly count: number;
};
export type Output = {
  readonly sheetArea: number;
  readonly areaBeatEffort: number;
  readonly catchPerAreaBeat: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sheetWidth: { type: "number", exclusiveMinimum: 0 },
    sheetLength: { type: "number", exclusiveMinimum: 0 },
    beats: { type: "integer", minimum: 1 },
    count: { type: "integer", minimum: 0 },
  },
  required: ["sheetWidth", "sheetLength", "beats", "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sheetArea: { type: "number" },
    areaBeatEffort: { type: "number" },
    catchPerAreaBeat: { type: "number" },
  },
  required: ["sheetArea", "areaBeatEffort", "catchPerAreaBeat"],
} as const;
/** Standardized sheet-area times beat effort; not an estimate of sampled vegetation area or insect density. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sheetWidth, sheetLength, beats, count } = request;
  const compute = (): Output => {
    H.positive(sheetWidth);
    H.positive(sheetLength);
    H.integer(beats, 1);
    H.integer(count, 0);
    return {
      sheetArea: sheetWidth * sheetLength,
      areaBeatEffort: sheetWidth * sheetLength * beats,
      catchPerAreaBeat: count / (sheetWidth * sheetLength * beats),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sheetWidth: 1, sheetLength: 0.5, beats: 10, count: 20 },
  output: { sheetArea: 0.5, areaBeatEffort: 5, catchPerAreaBeat: 4 },
} satisfies ToolExample<Input, Output>;
export const insectSurveyBeatSheetAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-survey-beat-sheet-area-term",
    title: "Insect Survey Beat Sheet Area Term Tool",
    description:
      "Standardized sheet-area times beat effort; not an estimate of sampled vegetation area or insect density.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sheetWidth: { type: "number", exclusiveMinimum: 0 },
        sheetLength: { type: "number", exclusiveMinimum: 0 },
        beats: { type: "integer", minimum: 1 },
        count: { type: "integer", minimum: 0 },
      },
      required: ["sheetWidth", "sheetLength", "beats", "count"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sheetArea: { type: "number" },
        areaBeatEffort: { type: "number" },
        catchPerAreaBeat: { type: "number" },
      },
      required: ["sheetArea", "areaBeatEffort", "catchPerAreaBeat"],
    },
    ports: {
      inputs: [
        {
          id: "sheetWidth",
          label: "Sheet Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sheetLength",
          label: "Sheet Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beats",
          label: "Beats",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "sheetArea", label: "Sheet Area", valueType: { type: "number" } },
        {
          id: "areaBeatEffort",
          label: "Area Beat Effort",
          valueType: { type: "number" },
        },
        {
          id: "catchPerAreaBeat",
          label: "Catch Per Area Beat",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectSurveyBeatSheetAreaTermTool.execute;
export default insectSurveyBeatSheetAreaTermTool;
