import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ flags: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "flags", kind: "string", label: "flags" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const allowed = "dgimsuvy",
    duplicates = H.duplicates(i.flags.split(""), (x) => x),
    unknown = H.unique(i.flags.split("").filter((x) => !allowed.includes(x))),
    conflict = i.flags.includes("u") && i.flags.includes("v");
  return H.finish({
    valid: !duplicates.length && !unknown.length && !conflict,
    duplicates,
    unknown,
    unicodeConflict: conflict,
  });
};
export const example = {
  input: { flags: "gguvx" },
  output: {
    result: {
      valid: false,
      duplicates: [{ key: "g", indexes: [0, 1] }],
      unknown: ["x"],
      unicodeConflict: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/regex-flag-set-audit",
  title: "Regex Flag Set Audit",
  description:
    "Audit syntactic ECMAScript flag names, duplicates and mutually exclusive u/v flags; does not assert every flag is supported by the installed runtime.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
