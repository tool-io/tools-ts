import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bookId: string;
  readonly suppliedRoleWording: string;
  readonly suppliedName: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bookId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRoleWording: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedName: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["bookId", "suppliedRoleWording", "suppliedName"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly transcribed Japanese-book colophon role and name without translating or identifying a person. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bookId, suppliedRoleWording, suppliedName } = request;
  const compute = (): Output => {
    H.domain(bookId.length > 0, "bookId");
    H.domain(suppliedRoleWording.length > 0, "suppliedRoleWording");
    H.domain(suppliedName.length > 0, "suppliedName");
    return {
      token: JSON.stringify([bookId, suppliedRoleWording, suppliedName]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bookId: "BOOK17",
    suppliedRoleWording: "printer role text",
    suppliedName: "Name A",
  },
  output: { token: '["BOOK17","printer role text","Name A"]' },
} satisfies ToolExample<Input, Output>;
export const japaneseBookOkudukeRoleLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["asian-studies", "asian studies", "humanities"],
      keywords: ["asian studies", "humanities"],
    },
    id: "asian-studies/japanese-book-okuduke-role-label",
    title: "Japanese Book Okuduke Role Label",
    description:
      "Preserve an explicitly transcribed Japanese-book colophon role and name without translating or identifying a person.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bookId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedRoleWording: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedName: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["bookId", "suppliedRoleWording", "suppliedName"],
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
          id: "bookId",
          label: "Book Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedRoleWording",
          label: "Supplied Role Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedName",
          label: "Supplied Name",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = japaneseBookOkudukeRoleLabelTool.execute;
export default japaneseBookOkudukeRoleLabelTool;
