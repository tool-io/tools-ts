import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly token: string };
export type Output = {
  readonly context: string;
  readonly message: string;
  readonly hasContext: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    context: { type: "string", maxLength: 8192 },
    message: { type: "string", maxLength: 8192 },
    hasContext: { type: "boolean" },
  },
  required: ["context", "message", "hasContext"],
} as const;
/** Compute gettext context message separator token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const i = token.indexOf("\u0004");
    domain(i === token.lastIndexOf("\u0004"));
    return {
      context: i < 0 ? "" : token.slice(0, i),
      message: i < 0 ? token : token.slice(i + 1),
      hasContext: i >= 0,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "menu\u0004Open" },
  output: { context: "menu", message: "Open", hasContext: true },
} satisfies ToolExample<Input, Output>;
export const gettextContextMessageSeparatorTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "parse/gettext-context-message-separator-token",
  title: "Gettext Context Message Separator Token Tool",
  description:
    "Compute gettext context message separator token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "token",
        label: "Token",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "context", label: "Context", valueType: { type: "string" } },
      { id: "message", label: "Message", valueType: { type: "string" } },
      {
        id: "hasContext",
        label: "Has Context",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = gettextContextMessageSeparatorTokenTool.execute;
export default gettextContextMessageSeparatorTokenTool;
