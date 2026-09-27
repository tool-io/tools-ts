import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly screened: number;
  readonly consented: number;
  readonly enrolled: number;
  readonly withdrawn: number;
};
export type Output = {
  readonly notConsented: number;
  readonly consentedNotEnrolled: number;
  readonly retainedEnrolled: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    screened: { type: "integer", minimum: 0 },
    consented: { type: "integer", minimum: 0 },
    enrolled: { type: "integer", minimum: 0 },
    withdrawn: { type: "integer", minimum: 0 },
  },
  required: ["screened", "consented", "enrolled", "withdrawn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    notConsented: { type: "integer" },
    consentedNotEnrolled: { type: "integer" },
    retainedEnrolled: { type: "integer" },
  },
  required: ["notConsented", "consentedNotEnrolled", "retainedEnrolled"],
} as const;
/** Calculate gcp enrollment log consented count balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { screened, consented, enrolled, withdrawn } = request;
  const compute = (): Output => {
    H.integer(screened, 0);
    H.integer(consented, 0, screened);
    H.integer(enrolled, 0, consented);
    H.integer(withdrawn, 0, enrolled);
    return {
      notConsented: screened - consented,
      consentedNotEnrolled: consented - enrolled,
      retainedEnrolled: enrolled - withdrawn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { screened: 100, consented: 80, enrolled: 60, withdrawn: 5 },
  output: { notConsented: 20, consentedNotEnrolled: 20, retainedEnrolled: 55 },
} satisfies ToolExample<Input, Output>;
export const gcpEnrollmentLogConsentedCountBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gcp/gcp-enrollment-log-consented-count-balance",
      title: "GCP Enrollment Log Consented Count Balance Tool",
      description:
        "Calculate gcp enrollment log consented count balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          screened: { type: "integer", minimum: 0 },
          consented: { type: "integer", minimum: 0 },
          enrolled: { type: "integer", minimum: 0 },
          withdrawn: { type: "integer", minimum: 0 },
        },
        required: ["screened", "consented", "enrolled", "withdrawn"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          notConsented: { type: "integer" },
          consentedNotEnrolled: { type: "integer" },
          retainedEnrolled: { type: "integer" },
        },
        required: ["notConsented", "consentedNotEnrolled", "retainedEnrolled"],
      },
      ports: {
        inputs: [
          {
            id: "screened",
            label: "Screened",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "consented",
            label: "Consented",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "enrolled",
            label: "Enrolled",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "withdrawn",
            label: "Withdrawn",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "notConsented",
            label: "Not Consented",
            valueType: { type: "integer" },
          },
          {
            id: "consentedNotEnrolled",
            label: "Consented Not Enrolled",
            valueType: { type: "integer" },
          },
          {
            id: "retainedEnrolled",
            label: "Retained Enrolled",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = gcpEnrollmentLogConsentedCountBalanceTool.execute;
export default gcpEnrollmentLogConsentedCountBalanceTool;
