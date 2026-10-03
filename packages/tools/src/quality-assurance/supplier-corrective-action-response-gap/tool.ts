import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestDay: number;
  readonly responseDay: number;
  readonly acceptedDay: number;
  readonly suppliedDeadline: number;
  readonly accepted: boolean;
};
export type Output = {
  readonly responseLag: number;
  readonly deadlineMargin: number;
  readonly acceptanceLag: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestDay: { type: "integer" },
    responseDay: { type: "integer" },
    acceptedDay: { type: "integer" },
    suppliedDeadline: { type: "integer" },
    accepted: { type: "boolean" },
  },
  required: [
    "requestDay",
    "responseDay",
    "acceptedDay",
    "suppliedDeadline",
    "accepted",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseLag: { type: "integer" },
    deadlineMargin: { type: "integer" },
    acceptanceLag: { type: "integer" },
  },
  required: ["responseLag", "deadlineMargin", "acceptanceLag"],
} as const;
/** Calculate supplier corrective action response gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestDay, responseDay, acceptedDay, suppliedDeadline, accepted } =
    request;
  const compute = (): Output => {
    H.domain(
      responseDay >= requestDay && (!accepted || acceptedDay >= responseDay),
    );
    return {
      responseLag: responseDay - requestDay,
      deadlineMargin: suppliedDeadline - responseDay,
      acceptanceLag: accepted ? acceptedDay - responseDay : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestDay: 100,
    responseDay: 108,
    acceptedDay: 110,
    suppliedDeadline: 110,
    accepted: true,
  },
  output: { responseLag: 8, deadlineMargin: 2, acceptanceLag: 2 },
} satisfies ToolExample<Input, Output>;
export const supplierCorrectiveActionResponseGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-assurance/supplier-corrective-action-response-gap",
      title: "Supplier Corrective Action Response Gap Tool",
      description:
        "Calculate supplier corrective action response gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requestDay: { type: "integer" },
          responseDay: { type: "integer" },
          acceptedDay: { type: "integer" },
          suppliedDeadline: { type: "integer" },
          accepted: { type: "boolean" },
        },
        required: [
          "requestDay",
          "responseDay",
          "acceptedDay",
          "suppliedDeadline",
          "accepted",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          responseLag: { type: "integer" },
          deadlineMargin: { type: "integer" },
          acceptanceLag: { type: "integer" },
        },
        required: ["responseLag", "deadlineMargin", "acceptanceLag"],
      },
      ports: {
        inputs: [
          {
            id: "requestDay",
            label: "Request Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "responseDay",
            label: "Response Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "acceptedDay",
            label: "Accepted Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "suppliedDeadline",
            label: "Supplied Deadline",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "accepted",
            label: "Accepted",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "responseLag",
            label: "Response Lag",
            valueType: { type: "integer" },
          },
          {
            id: "deadlineMargin",
            label: "Deadline Margin",
            valueType: { type: "integer" },
          },
          {
            id: "acceptanceLag",
            label: "Acceptance Lag",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = supplierCorrectiveActionResponseGapTool.execute;
export default supplierCorrectiveActionResponseGapTool;
