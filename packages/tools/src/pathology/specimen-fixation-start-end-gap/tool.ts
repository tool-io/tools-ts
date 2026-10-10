import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startTimestampMinutes: number;
  readonly endTimestampMinutes: number;
};
export type Output = { readonly durationMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startTimestampMinutes: { type: "number" },
    endTimestampMinutes: { type: "number" },
  },
  required: ["startTimestampMinutes", "endTimestampMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationMinutes: { type: "number" } },
  required: ["durationMinutes"],
} as const;
/** Measure a supplied fixation interval on one elapsed-minute timeline without assessing tissue-processing suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startTimestampMinutes, endTimestampMinutes } = request;
  const compute = (): Output => {
    H.domain(
      endTimestampMinutes >= startTimestampMinutes,
      "endTimestampMinutes",
    );
    return { durationMinutes: endTimestampMinutes - startTimestampMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startTimestampMinutes: 100, endTimestampMinutes: 460 },
  output: { durationMinutes: 360 },
} satisfies ToolExample<Input, Output>;
export const specimenFixationStartEndGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pathology", "health and medicine"],
      keywords: ["pathology", "health and medicine"],
    },
    id: "pathology/specimen-fixation-start-end-gap",
    title: "Specimen Fixation Start End Gap",
    description:
      "Measure a supplied fixation interval on one elapsed-minute timeline without assessing tissue-processing suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startTimestampMinutes: { type: "number" },
        endTimestampMinutes: { type: "number" },
      },
      required: ["startTimestampMinutes", "endTimestampMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { durationMinutes: { type: "number" } },
      required: ["durationMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "startTimestampMinutes",
          label: "Start Timestamp Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endTimestampMinutes",
          label: "End Timestamp Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationMinutes",
          label: "Duration Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = specimenFixationStartEndGapTool.execute;
export default specimenFixationStartEndGapTool;
