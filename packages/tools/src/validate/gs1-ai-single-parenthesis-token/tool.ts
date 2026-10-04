import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^\(\d{2,4}\)(?![\s\S])/.test(i.token));
  return H.finish({
    applicationIdentifier: i.token.slice(1, -1),
    semanticRegistryChecked: false,
  });
};
export const example = {
  input: { token: "(01)" },
  output: {
    result: { applicationIdentifier: "01", semanticRegistryChecked: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "validate/gs1-ai-single-parenthesis-token",
  title: "Validation: Gs1 AI Single Parenthesis Token Tool",
  description:
    "Parse one human-readable GS1 application-identifier parenthesis token of two through four digits; does not validate AI allocation, payload or barcode encoding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          applicationIdentifier: { type: "string" },
          semanticRegistryChecked: { type: "boolean" },
        },
        required: ["applicationIdentifier", "semanticRegistryChecked"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
