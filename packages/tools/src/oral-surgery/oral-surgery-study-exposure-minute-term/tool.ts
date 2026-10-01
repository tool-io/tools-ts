import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactMinutes: readonly number[];
  readonly participants: readonly number[];
  readonly excludedMinutes: number;
};
export type Output = {
  readonly grossPersonMinutes: number;
  readonly netPersonMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactMinutes: { type: "array", maxItems: 256, items: { type: "number" } },
    participants: { type: "array", maxItems: 256, items: { type: "integer" } },
    excludedMinutes: { type: "number", minimum: 0 },
  },
  required: ["contactMinutes", "participants", "excludedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossPersonMinutes: { type: "number" },
    netPersonMinutes: { type: "number" },
  },
  required: ["grossPersonMinutes", "netPersonMinutes"],
} as const;
/** Calculate oral surgery study exposure minute term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactMinutes, participants, excludedMinutes } = request;
  const compute = (): Output => {
    H.sameLength(contactMinutes, participants);
    H.domain(
      contactMinutes.every((x) => x >= 0) &&
        participants.every((x) => x >= 0) &&
        excludedMinutes >= 0 &&
        excludedMinutes <= H.dot(contactMinutes, participants),
    );
    return {
      grossPersonMinutes: H.dot(contactMinutes, participants),
      netPersonMinutes: H.dot(contactMinutes, participants) - excludedMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contactMinutes: [30, 20],
    participants: [2, 3],
    excludedMinutes: 10,
  },
  output: { grossPersonMinutes: 120, netPersonMinutes: 110 },
} satisfies ToolExample<Input, Output>;
export const oralSurgeryStudyExposureMinuteTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/oral-surgery-study-exposure-minute-term",
    title: "Oral Surgery Study Exposure Minute Term Tool",
    description:
      "Calculate oral surgery study exposure minute term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactMinutes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        participants: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        excludedMinutes: { type: "number", minimum: 0 },
      },
      required: ["contactMinutes", "participants", "excludedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossPersonMinutes: { type: "number" },
        netPersonMinutes: { type: "number" },
      },
      required: ["grossPersonMinutes", "netPersonMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "contactMinutes",
          label: "Contact Minutes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "participants",
          label: "Participants",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
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
          id: "grossPersonMinutes",
          label: "Gross Person Minutes",
          valueType: { type: "number" },
        },
        {
          id: "netPersonMinutes",
          label: "Net Person Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = oralSurgeryStudyExposureMinuteTermTool.execute;
export default oralSurgeryStudyExposureMinuteTermTool;
