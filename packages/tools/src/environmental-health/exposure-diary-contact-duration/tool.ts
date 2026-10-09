import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startMinutes: number;
  readonly endMinutes: number;
  readonly excludedMinutes: number;
};
export type Output = { readonly recordedContactMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startMinutes: { type: "number" },
    endMinutes: { type: "number" },
    excludedMinutes: { type: "number", minimum: 0 },
  },
  required: ["startMinutes", "endMinutes", "excludedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recordedContactMinutes: { type: "number" } },
  required: ["recordedContactMinutes"],
} as const;
/** Subtract explicit noncontact intervals from a recorded diary contact window without estimating absorbed exposure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startMinutes, endMinutes, excludedMinutes } = request;
  const compute = (): Output => {
    H.domain(
      endMinutes >= startMinutes &&
        excludedMinutes >= 0 &&
        excludedMinutes <= endMinutes - startMinutes,
      "endMinutes",
    );
    return {
      recordedContactMinutes: endMinutes - startMinutes - excludedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startMinutes: 60, endMinutes: 150, excludedMinutes: 15 },
  output: { recordedContactMinutes: 75 },
} satisfies ToolExample<Input, Output>;
export const exposureDiaryContactDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-health",
        "environmental health",
        "health and medicine",
      ],
      keywords: ["environmental health", "health and medicine"],
    },
    id: "environmental-health/exposure-diary-contact-duration",
    title: "Exposure Diary Contact Duration",
    description:
      "Subtract explicit noncontact intervals from a recorded diary contact window without estimating absorbed exposure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startMinutes: { type: "number" },
        endMinutes: { type: "number" },
        excludedMinutes: { type: "number", minimum: 0 },
      },
      required: ["startMinutes", "endMinutes", "excludedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recordedContactMinutes: { type: "number" } },
      required: ["recordedContactMinutes"],
    },
    ports: {
      inputs: [
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
        {
          id: "excludedMinutes",
          label: "Excluded Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "recordedContactMinutes",
          label: "Recorded Contact Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exposureDiaryContactDurationTool.execute;
export default exposureDiaryContactDurationTool;
