import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  components,
} from "../batch53-shared.js";

export type Input = Readonly<{ member: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "member", label: "Member", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (i.member.includes("\0")) simpleError("member", "NUL unsupported.");
  let depth = 0,
    escaped = false;
  const parentIndexes: number[] = [];
  components(i.member).forEach((c, j) => {
    if (c === "..") {
      parentIndexes.push(j);
      if (depth === 0) escaped = true;
      else depth--;
    } else if (c !== ".") depth++;
  });
  return {
    absolute: i.member.startsWith("/"),
    parentComponentIndexes: parentIndexes,
    lexicalRootEscape: escaped,
    backslashAmbiguity: i.member.includes("\\"),
    extractionSafetyEstablished: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { member: "../a" },
  output: {
    result: {
      absolute: false,
      parentComponentIndexes: [0],
      lexicalRootEscape: true,
      backslashAmbiguity: false,
      extractionSafetyEstablished: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/archive-member-parent-traversal-audit",
  title: "Archive Member Parent Traversal Audit",
  description:
    "Audit literal POSIX archive traversal evidence and backslash ambiguity; not a secure extraction approval or symlink defense.",
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
