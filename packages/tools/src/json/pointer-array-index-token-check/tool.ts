import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{
  token: string;
  arrayLength: number;
  allowAppend: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
  { id: "arrayLength", label: "Array length", kind: "number" },
  { id: "allowAppend", label: "Allow append", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.arrayLength, "length", 0, 1e9);
  const append = i.token === "-",
    canonical = /^(?:0|[1-9][0-9]*)$(?![\s\S])/.test(i.token),
    safe = canonical && Number.isSafeInteger(Number(i.token));
  return {
    canonicalIndex: canonical,
    safeIndex: safe ? Number(i.token) : null,
    withinArray: safe && Number(i.token) < i.arrayLength,
    appendAllowed: append && i.allowAppend,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { token: "01", arrayLength: 3, allowAppend: true },
  output: {
    result: {
      canonicalIndex: false,
      safeIndex: null,
      withinArray: false,
      appendAllowed: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/pointer-array-index-token-check",
  title: "JSON Pointer Array Index Token Check",
  description:
    "Audit a decoded JSON Pointer array index token: canonical decimal, safe integer, in-range and optional append marker are distinct checks.",
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
