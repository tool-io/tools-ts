import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitId: string;
  readonly startMinutes: number;
  readonly endMinutes: number;
};
export type Output = {
  readonly durationMinutes: number;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitId: { type: "string", maxLength: 8192, minLength: 1 },
    startMinutes: { type: "number" },
    endMinutes: { type: "number" },
  },
  required: ["visitId", "startMinutes", "endMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationMinutes: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["durationMinutes", "label"],
} as const;
/** Label the elapsed duration between explicit visit markers without assessing or recommending a visit length. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitId, startMinutes, endMinutes } = request;
  const compute = (): Output => {
    H.domain(visitId.length > 0, "visitId");
    H.domain(endMinutes >= startMinutes, "endMinutes");
    return {
      durationMinutes: endMinutes - startMinutes,
      label: visitId + "; duration=" + (endMinutes - startMinutes) + " min",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { visitId: "V17", startMinutes: 540, endMinutes: 585 },
  output: { durationMinutes: 45, label: "V17; duration=45 min" },
} satisfies ToolExample<Input, Output>;
export const osteopathyVisitDurationLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["osteopathy", "health and medicine"],
      keywords: ["osteopathy", "health and medicine"],
    },
    id: "osteopathy/osteopathy-visit-duration-label",
    title: "Osteopathy Visit Duration Label",
    description:
      "Label the elapsed duration between explicit visit markers without assessing or recommending a visit length.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitId: { type: "string", maxLength: 8192, minLength: 1 },
        startMinutes: { type: "number" },
        endMinutes: { type: "number" },
      },
      required: ["visitId", "startMinutes", "endMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationMinutes: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["durationMinutes", "label"],
    },
    ports: {
      inputs: [
        {
          id: "visitId",
          label: "Visit Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "startMinutes",
          label: "Start Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endMinutes",
          label: "End Minutes",
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
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = osteopathyVisitDurationLabelTool.execute;
export default osteopathyVisitDurationLabelTool;
