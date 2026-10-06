import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionCount: number;
  readonly minutesPerSession: number;
};
export type Output = {
  readonly contactMinutes: number;
  readonly contactHours: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionCount: { type: "integer", minimum: 0 },
    minutesPerSession: { type: "number", minimum: 0 },
  },
  required: ["sessionCount", "minutesPerSession"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactMinutes: { type: "number" },
    contactHours: { type: "number" },
  },
  required: ["contactMinutes", "contactHours"],
} as const;
/** Sum identical class contact sessions into ordinary 60-minute hours rather than institution-specific credit hours. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionCount, minutesPerSession } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sessionCount) &&
        sessionCount >= 0 &&
        sessionCount <= Number.MAX_SAFE_INTEGER,
      "sessionCount",
    ),
      sessionCount);
    H.domain(minutesPerSession >= 0, "minutesPerSession");
    return {
      contactMinutes: sessionCount * minutesPerSession,
      contactHours: (sessionCount * minutesPerSession) / 60,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sessionCount: 12, minutesPerSession: 90 },
  output: { contactMinutes: 1080, contactHours: 18 },
} satisfies ToolExample<Input, Output>;
export const adultClassContactHourDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/adult-class-contact-hour-duration",
    title: "Adult Class Contact Hour Duration",
    description:
      "Sum identical class contact sessions into ordinary 60-minute hours rather than institution-specific credit hours.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionCount: { type: "integer", minimum: 0 },
        minutesPerSession: { type: "number", minimum: 0 },
      },
      required: ["sessionCount", "minutesPerSession"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contactMinutes: { type: "number" },
        contactHours: { type: "number" },
      },
      required: ["contactMinutes", "contactHours"],
    },
    ports: {
      inputs: [
        {
          id: "sessionCount",
          label: "Session Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "minutesPerSession",
          label: "Minutes Per Session",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contactMinutes",
          label: "Contact Minutes",
          valueType: { type: "number" },
        },
        {
          id: "contactHours",
          label: "Contact Hours",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = adultClassContactHourDurationTool.execute;
export default adultClassContactHourDurationTool;
