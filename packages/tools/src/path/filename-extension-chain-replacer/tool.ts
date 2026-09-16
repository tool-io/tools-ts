import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  extensionParts,
} from "../batch53-shared.js";

export type Input = Readonly<{ name: string; extensions: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "name", label: "Name", kind: "string" },
  { id: "extensions", label: "Extensions", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const p = extensionParts(i.name);
  if (i.extensions.some((v) => !v || /[.\/\0]/.test(v)))
    simpleError("extensions", "Nonempty dot/slash-free extension segments.");
  return {
    name: p.stem + (i.extensions.length ? "." + i.extensions.join(".") : ""),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { name: "archive.tar.gz", extensions: ["zip"] },
  output: { result: { name: "archive.zip" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/filename-extension-chain-replacer",
  title: "Filename Extension Chain Replacer",
  description:
    "Replace the complete literal extension chain while preserving the leading-dot-aware stem; an empty extension list removes the chain.",
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
