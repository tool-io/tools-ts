import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  state: string;
  missingToken: string;
  presentText: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "state", label: "State", kind: "string", enum: ["present", "missing"] },
  { id: "missingToken", label: "Missing token", kind: "string" },
  { id: "presentText", label: "Present text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.state, ["present", "missing"]);
  return H.finish({
    display: i.state === "missing" ? i.missingToken : i.presentText,
    isMissing: i.state === "missing",
  });
};
export const example = {
  input: { state: "missing", missingToken: "NA", presentText: "0" },
  output: { result: { display: "NA", isMissing: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/missing-value-display-token-map",
  title: "Formatting: Missing Value Display Token Map Tool",
  description:
    "Choose an explicit missing-value display token only from a declared missing state, never inferring missingness from zero or empty text.",
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
          display: { type: "string" },
          isMissing: { type: "boolean" },
        },
        required: ["display", "isMissing"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
