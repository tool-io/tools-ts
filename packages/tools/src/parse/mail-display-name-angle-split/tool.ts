import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly mailbox: string };
export type Output = { readonly displayName: string; readonly address: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mailbox: { type: "string", maxLength: 8192 } },
  required: ["mailbox"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayName: { type: "string", maxLength: 8192 },
    address: { type: "string", maxLength: 8192 },
  },
  required: ["displayName", "address"],
} as const;
/** Split a simple unquoted display-name and angle-address mailbox. Comments, quoted names and complete RFC 5322 address validation are outside this restricted grammar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mailbox } = request;
  const compute = (): Output => {
    H.domain(!/[\r\n]/.test(mailbox), "mailbox");
    const match = /^([^<>]*)<([^<>\s]+@[^<>\s]+)>(?![\s\S])/.exec(mailbox);
    H.domain(match, "mailbox");
    H.domain(!/["()]/.test(match[1]), "mailbox");
    return { displayName: match[1].trim(), address: match[2] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mailbox: "Ada Lovelace <ada@example.org>" },
  output: { displayName: "Ada Lovelace", address: "ada@example.org" },
} satisfies ToolExample<Input, Output>;
export const mailDisplayNameAngleSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "parse/mail-display-name-angle-split",
    title: "Mail Display Name Angle Split Tool",
    description:
      "Split a simple unquoted display-name and angle-address mailbox. Comments, quoted names and complete RFC 5322 address validation are outside this restricted grammar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mailbox: { type: "string", maxLength: 8192 } },
      required: ["mailbox"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displayName: { type: "string", maxLength: 8192 },
        address: { type: "string", maxLength: 8192 },
      },
      required: ["displayName", "address"],
    },
    ports: {
      inputs: [
        {
          id: "mailbox",
          label: "Mailbox",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "displayName",
          label: "Display Name",
          valueType: { type: "string" },
        },
        { id: "address", label: "Address", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = mailDisplayNameAngleSplitTool.execute;
export default mailDisplayNameAngleSplitTool;
