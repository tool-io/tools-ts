import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly validityStatus: string;
  readonly reason: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    validityStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["valid", "invalid", "undetermined"],
    },
    reason: { type: "string", maxLength: 8192 },
  },
  required: ["itemId", "validityStatus", "reason"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label an explicitly assigned exam-response validity status and reason without inferring invalidity from the response. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, validityStatus, reason } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0, "itemId");
    H.domain(
      ["valid", "invalid", "undetermined"].includes(validityStatus),
      "validityStatus",
    );
    H.domain(
      validityStatus !== "invalid" || reason.trim().length > 0,
      "reason",
    );
    return {
      tag:
        itemId +
        " [" +
        validityStatus +
        (reason.length > 0 ? "; " + reason : "") +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemId: "Q17",
    validityStatus: "invalid",
    reason: "duplicate marking",
  },
  output: { tag: "Q17 [invalid; duplicate marking]" },
} satisfies ToolExample<Input, Output>;
export const examResponseInvalidityTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "educational-psychology",
        "educational psychology",
        "psychology",
      ],
      keywords: ["educational psychology", "psychology"],
    },
    id: "educational-psychology/exam-response-invalidity-tag",
    title: "Exam Response Invalidity Tag",
    description:
      "Label an explicitly assigned exam-response validity status and reason without inferring invalidity from the response.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        validityStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["valid", "invalid", "undetermined"],
        },
        reason: { type: "string", maxLength: 8192 },
      },
      required: ["itemId", "validityStatus", "reason"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "validityStatus",
          label: "Validity Status",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reason",
          label: "Reason",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = examResponseInvalidityTagTool.execute;
export default examResponseInvalidityTagTool;
