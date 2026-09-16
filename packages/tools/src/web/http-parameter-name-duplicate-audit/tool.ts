import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";
import {
  splitHeaderValue,
  parseHeaderParameter,
} from "../../http/content-type-parser/tool.js";
export type Input = Readonly<{ parameterList: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parameterList", label: "Parameter list", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const parts = splitHeaderValue(i.parameterList, ";");
  if (!parts) simpleError("parameters", "Well-formed quoted parameter list.");
  const names = parts.map((v) => {
    const p = parseHeaderParameter(v);
    if (!p) simpleError("parameter", "Valid name=value parameter.");
    return p.name.toLowerCase();
  });
  return {
    duplicates: [...new Set(names)]
      .filter((k) => names.filter((v) => v === k).length > 1)
      .map((name) => ({
        name,
        indexes: names.flatMap((v, j) => (v === name ? [j] : [])),
      })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { parameterList: "charset=utf-8; CHARSET=ascii" },
  output: { result: { duplicates: [{ name: "charset", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/http-parameter-name-duplicate-audit",
  title: "HTTP Parameter Name Duplicate Audit",
  description:
    "Audit case-insensitive HTTP parameter-name duplicates using the existing quote-aware parameter parser; accepts a parameter list, not a whole header.",
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
