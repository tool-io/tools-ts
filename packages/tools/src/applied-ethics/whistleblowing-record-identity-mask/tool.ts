import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly identityText: string;
  readonly publishIdentity: boolean;
  readonly suppliedMask: string;
};
export type Output = { readonly displayIdentity: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identityText: { type: "string", maxLength: 8192 },
    publishIdentity: { type: "boolean" },
    suppliedMask: { type: "string", maxLength: 8192 },
  },
  required: ["identityText", "publishIdentity", "suppliedMask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { displayIdentity: { type: "string", maxLength: 8192 } },
  required: ["displayIdentity"],
} as const;
/** Choose supplied identity text or supplied mask under an explicit disclosure flag, without claiming anonymization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identityText, publishIdentity, suppliedMask } = request;
  const compute = (): Output => {
    return { displayIdentity: publishIdentity ? identityText : suppliedMask };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    identityText: "Name A",
    publishIdentity: false,
    suppliedMask: "Witness 17",
  },
  output: { displayIdentity: "Witness 17" },
} satisfies ToolExample<Input, Output>;
export const whistleblowingRecordIdentityMaskTool = H.defineSchemaCalculation<
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
    id: "applied-ethics/whistleblowing-record-identity-mask",
    title: "Whistleblowing Record Identity Mask",
    description:
      "Choose supplied identity text or supplied mask under an explicit disclosure flag, without claiming anonymization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identityText: { type: "string", maxLength: 8192 },
        publishIdentity: { type: "boolean" },
        suppliedMask: { type: "string", maxLength: 8192 },
      },
      required: ["identityText", "publishIdentity", "suppliedMask"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { displayIdentity: { type: "string", maxLength: 8192 } },
      required: ["displayIdentity"],
    },
    ports: {
      inputs: [
        {
          id: "identityText",
          label: "Identity Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publishIdentity",
          label: "Publish Identity",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedMask",
          label: "Supplied Mask",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "displayIdentity",
          label: "Display Identity",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = whistleblowingRecordIdentityMaskTool.execute;
export default whistleblowingRecordIdentityMaskTool;
