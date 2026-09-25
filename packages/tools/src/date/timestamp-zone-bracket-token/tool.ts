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
  H.check(
    /^\[[A-Za-z0-9_+.-]+(?:\/[A-Za-z0-9_+.-]+)*\](?![\s\S])/.test(i.token),
  );
  H.check(
    !i.token
      .slice(1, -1)
      .split("/")
      .some((s) => s === "." || s === ".."),
  );
  return H.finish({ zone: i.token.slice(1, -1), databaseVerified: false });
};
export const example = {
  input: { token: "[Europe/London]" },
  output: { result: { zone: "Europe/London", databaseVerified: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "date/timestamp-zone-bracket-token",
  title: "Date: Timestamp Zone Bracket Token Tool",
  description:
    "Extract one conservative bracketed timestamp timezone annotation token; grammar validity does not establish IANA membership or resolve an instant.",
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
          databaseVerified: { type: "boolean" },
          zone: { type: "string" },
        },
        required: ["databaseVerified", "zone"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
