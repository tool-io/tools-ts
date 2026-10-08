import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly presented: boolean;
  readonly responseObserved: boolean;
  readonly declined: boolean;
};
export type Output = { readonly code: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presented: { type: "boolean" },
    responseObserved: { type: "boolean" },
    declined: { type: "boolean" },
  },
  required: ["presented", "responseObserved", "declined"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { code: { type: "string", maxLength: 8192 } },
  required: ["code"],
} as const;
/** Encode explicit item presentation, response and decline states without converting nonresponse into a developmental score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { presented, responseObserved, declined } = request;
  const compute = (): Output => {
    H.domain(!responseObserved || presented, "responseObserved");
    H.domain(!declined || presented, "declined");
    H.domain(!(responseObserved && declined), "responseObserved");
    return {
      code: !presented
        ? "not-presented"
        : responseObserved
          ? "response-recorded"
          : declined
            ? "declined"
            : "no-response",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { presented: true, responseObserved: false, declined: true },
  output: { code: "declined" },
} satisfies ToolExample<Input, Output>;
export const developmentalItemNonresponseCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "developmental-psychology",
        "developmental psychology",
        "psychology",
      ],
      keywords: ["developmental psychology", "psychology"],
    },
    id: "developmental-psychology/developmental-item-nonresponse-code",
    title: "Developmental Item Nonresponse Code",
    description:
      "Encode explicit item presentation, response and decline states without converting nonresponse into a developmental score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presented: { type: "boolean" },
        responseObserved: { type: "boolean" },
        declined: { type: "boolean" },
      },
      required: ["presented", "responseObserved", "declined"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { code: { type: "string", maxLength: 8192 } },
      required: ["code"],
    },
    ports: {
      inputs: [
        {
          id: "presented",
          label: "Presented",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "responseObserved",
          label: "Response Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "declined",
          label: "Declined",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "code", label: "Code", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = developmentalItemNonresponseCodeTool.execute;
export default developmentalItemNonresponseCodeTool;
