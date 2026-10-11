import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestId: string;
  readonly suppliedClockStartDate: string;
  readonly acknowledgmentDateText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedClockStartDate: { type: "string", maxLength: 8192, minLength: 1 },
    acknowledgmentDateText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["requestId", "suppliedClockStartDate", "acknowledgmentDateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit public-request clock-start and acknowledgment date wording without deciding statutory clock rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestId, suppliedClockStartDate, acknowledgmentDateText } = request;
  const compute = (): Output => {
    H.domain(requestId.length > 0, "requestId");
    H.domain(suppliedClockStartDate.length > 0, "suppliedClockStartDate");
    H.domain(acknowledgmentDateText.length > 0, "acknowledgmentDateText");
    return {
      token: JSON.stringify([
        requestId,
        suppliedClockStartDate,
        acknowledgmentDateText,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestId: "REQ17",
    suppliedClockStartDate: "2026-10-28",
    acknowledgmentDateText: "2026-11-01",
  },
  output: { token: '["REQ17","2026-10-28","2026-11-01"]' },
} satisfies ToolExample<Input, Output>;
export const publicRequestClockStartAckDatePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "public-administration",
        "public administration",
        "social sciences",
      ],
      keywords: ["public administration", "social sciences"],
    },
    id: "public-administration/public-request-clock-start-ack-date-pair",
    title: "Public Request Clock Start Ack Date Pair",
    description:
      "Preserve explicit public-request clock-start and acknowledgment date wording without deciding statutory clock rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedClockStartDate: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        acknowledgmentDateText: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: [
        "requestId",
        "suppliedClockStartDate",
        "acknowledgmentDateText",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "requestId",
          label: "Request Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedClockStartDate",
          label: "Supplied Clock Start Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "acknowledgmentDateText",
          label: "Acknowledgment Date Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicRequestClockStartAckDatePairTool.execute;
export default publicRequestClockStartAckDatePairTool;
