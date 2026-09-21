import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly registrationDay: number;
  readonly firstEnrollmentDay: number;
  readonly publicationDay: number;
};
export type Output = {
  readonly registrationLeadDays: number;
  readonly publicationLagDays: number;
  readonly prospective: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registrationDay: { type: "integer" },
    firstEnrollmentDay: { type: "integer" },
    publicationDay: { type: "integer" },
  },
  required: ["registrationDay", "firstEnrollmentDay", "publicationDay"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registrationLeadDays: { type: "integer" },
    publicationLagDays: { type: "integer" },
    prospective: { type: "boolean" },
  },
  required: ["registrationLeadDays", "publicationLagDays", "prospective"],
} as const;
/** Calculate acupuncture study registered date offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { registrationDay, firstEnrollmentDay, publicationDay } = request;
  const compute = (): Output => {
    H.domain(publicationDay >= firstEnrollmentDay);
    return {
      registrationLeadDays: firstEnrollmentDay - registrationDay,
      publicationLagDays: publicationDay - firstEnrollmentDay,
      prospective: registrationDay <= firstEnrollmentDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { registrationDay: 100, firstEnrollmentDay: 110, publicationDay: 300 },
  output: {
    registrationLeadDays: 10,
    publicationLagDays: 190,
    prospective: true,
  },
} satisfies ToolExample<Input, Output>;
export const acupunctureStudyRegisteredDateOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "acupuncture/acupuncture-study-registered-date-offset",
      title: "Acupuncture Study Registered Date Offset Tool",
      description:
        "Calculate acupuncture study registered date offset from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          registrationDay: { type: "integer" },
          firstEnrollmentDay: { type: "integer" },
          publicationDay: { type: "integer" },
        },
        required: ["registrationDay", "firstEnrollmentDay", "publicationDay"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          registrationLeadDays: { type: "integer" },
          publicationLagDays: { type: "integer" },
          prospective: { type: "boolean" },
        },
        required: ["registrationLeadDays", "publicationLagDays", "prospective"],
      },
      ports: {
        inputs: [
          {
            id: "registrationDay",
            label: "Registration Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstEnrollmentDay",
            label: "First Enrollment Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "publicationDay",
            label: "Publication Day",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "registrationLeadDays",
            label: "Registration Lead Days",
            valueType: { type: "integer" },
          },
          {
            id: "publicationLagDays",
            label: "Publication Lag Days",
            valueType: { type: "integer" },
          },
          {
            id: "prospective",
            label: "Prospective",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = acupunctureStudyRegisteredDateOffsetTool.execute;
export default acupunctureStudyRegisteredDateOffsetTool;
