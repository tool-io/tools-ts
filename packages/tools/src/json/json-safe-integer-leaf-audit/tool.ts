import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  parseJson,
  jsonLeaves,
} from "../batch53-shared.js";

export type Input = Readonly<{ documentJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "documentJson", label: "Document json", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    unsafeNumberPaths: jsonLeaves(parseJson(i.documentJson))
      .filter(
        (v) =>
          typeof v.value === "number" &&
          (!Number.isInteger(v.value) || !Number.isSafeInteger(v.value)),
      )
      .map((v) => v.path),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { documentJson: '{"a":1.5,"b":2,"c":9007199254740992}' },
  output: { result: { unsafeNumberPaths: ["/a", "/c"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-safe-integer-leaf-audit",
  title: "JSON Safe Integer Leaf Audit",
  description:
    "Audit decoded numeric JSON leaves for safe-integer membership; decimal fractions fail too, and precision already lost while parsing is not recovered.",
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
