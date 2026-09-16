import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  filename,
} from "../batch53-shared.js";

export type Input = Readonly<{ names: readonly string[]; form: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "names", label: "Names", kind: "stringList" },
  { id: "form", label: "Form", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!["NFC", "NFD", "NFKC", "NFKD"].includes(i.form))
    simpleError("form", "Explicit Unicode normalization form.");
  i.names.forEach(filename);
  const a = i.names.map((v) => v.normalize(i.form as "NFC"));
  return {
    collisions: [...new Set(a)].flatMap((normalized) => {
      const indexes = a.flatMap((v, j) => (v === normalized ? [j] : []));
      return indexes.length > 1 ? [{ normalized, indexes }] : [];
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { names: ["é", "é"], form: "NFC" },
  output: { result: { collisions: [{ normalized: "é", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/filename-normalization-collision-table",
  title: "Filename Unicode Normalization Collision Table",
  description:
    "Audit filenames colliding after an explicit Unicode normalization form; no assumption about the target filesystem normalization policy.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
