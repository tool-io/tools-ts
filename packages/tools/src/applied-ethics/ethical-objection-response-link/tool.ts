import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly objectionId: string;
  readonly responseId: string;
};
export type Output = { readonly link: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    objectionId: { type: "string", maxLength: 8192, minLength: 1 },
    responseId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["objectionId", "responseId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { link: { type: "string", maxLength: 8192 } },
  required: ["link"],
} as const;
/** Encode an explicitly supplied objection-to-response association without deciding whether the response answers the objection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { objectionId, responseId } = request;
  const compute = (): Output => {
    H.domain(objectionId.length > 0 && responseId.length > 0, "objectionId");
    return { link: JSON.stringify([objectionId, responseId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { objectionId: "O17", responseId: "R4" },
  output: { link: '["O17","R4"]' },
} satisfies ToolExample<Input, Output>;
export const ethicalObjectionResponseLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/ethical-objection-response-link",
    title: "Ethical Objection Response Link",
    description:
      "Encode an explicitly supplied objection-to-response association without deciding whether the response answers the objection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        objectionId: { type: "string", maxLength: 8192, minLength: 1 },
        responseId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["objectionId", "responseId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { link: { type: "string", maxLength: 8192 } },
      required: ["link"],
    },
    ports: {
      inputs: [
        {
          id: "objectionId",
          label: "Objection Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "responseId",
          label: "Response Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "link", label: "Link", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ethicalObjectionResponseLinkTool.execute;
export default ethicalObjectionResponseLinkTool;
