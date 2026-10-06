import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseId: string;
  readonly eventWording: string;
  readonly timeText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseId: { type: "string", maxLength: 8192, minLength: 1 },
    eventWording: { type: "string", maxLength: 8192, minLength: 1 },
    timeText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caseId", "eventWording", "timeText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit anesthesia case-event time text without inferring event timing or adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseId, eventWording, timeText } = request;
  const compute = (): Output => {
    H.domain(
      caseId.length > 0 && eventWording.length > 0 && timeText.length > 0,
      "caseId",
    );
    return {
      label: caseId + "; " + eventWording + " at " + JSON.stringify(timeText),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    caseId: "C17",
    eventWording: "recorded event A",
    timeText: "10:30 UTC",
  },
  output: { label: 'C17; recorded event A at "10:30 UTC"' },
} satisfies ToolExample<Input, Output>;
export const anesthesiaCaseEventTimeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["anesthesiology", "health and medicine"],
      keywords: ["anesthesiology", "health and medicine"],
    },
    id: "anesthesiology/anesthesia-case-event-time-label",
    title: "Anesthesia Case Event Time Label",
    description:
      "Label explicit anesthesia case-event time text without inferring event timing or adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseId: { type: "string", maxLength: 8192, minLength: 1 },
        eventWording: { type: "string", maxLength: 8192, minLength: 1 },
        timeText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["caseId", "eventWording", "timeText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "caseId",
          label: "Case Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "eventWording",
          label: "Event Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "timeText",
          label: "Time Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = anesthesiaCaseEventTimeLabelTool.execute;
export default anesthesiaCaseEventTimeLabelTool;
