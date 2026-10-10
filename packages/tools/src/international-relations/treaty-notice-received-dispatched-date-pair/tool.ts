import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noticeId: string;
  readonly dispatchedDateText: string;
  readonly receivedDateText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeId: { type: "string", maxLength: 8192, minLength: 1 },
    dispatchedDateText: { type: "string", maxLength: 8192, minLength: 1 },
    receivedDateText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["noticeId", "dispatchedDateText", "receivedDateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit treaty-notice dispatch and receipt date wording without choosing the legally effective date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noticeId, dispatchedDateText, receivedDateText } = request;
  const compute = (): Output => {
    H.domain(noticeId.length > 0, "noticeId");
    H.domain(dispatchedDateText.length > 0, "dispatchedDateText");
    H.domain(receivedDateText.length > 0, "receivedDateText");
    return {
      token: JSON.stringify([noticeId, dispatchedDateText, receivedDateText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    noticeId: "N17",
    dispatchedDateText: "2026-10-28",
    receivedDateText: "2026-11-01",
  },
  output: { token: '["N17","2026-10-28","2026-11-01"]' },
} satisfies ToolExample<Input, Output>;
export const treatyNoticeReceivedDispatchedDatePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "international-relations",
          "international relations",
          "social sciences",
        ],
        keywords: ["international relations", "social sciences"],
      },
      id: "international-relations/treaty-notice-received-dispatched-date-pair",
      title: "Treaty Notice Received Dispatched Date Pair",
      description:
        "Preserve explicit treaty-notice dispatch and receipt date wording without choosing the legally effective date.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          noticeId: { type: "string", maxLength: 8192, minLength: 1 },
          dispatchedDateText: { type: "string", maxLength: 8192, minLength: 1 },
          receivedDateText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["noticeId", "dispatchedDateText", "receivedDateText"],
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
            id: "noticeId",
            label: "Notice Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "dispatchedDateText",
            label: "Dispatched Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "receivedDateText",
            label: "Received Date Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = treatyNoticeReceivedDispatchedDatePairTool.execute;
export default treatyNoticeReceivedDispatchedDatePairTool;
