import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{ text: string; opener: string; closer: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "opener", label: "Opener", kind: "string" },
  { id: "closer", label: "Closer", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (i.opener.length !== 1 || i.closer.length !== 1 || i.opener === i.closer)
    simpleError("pair", "Distinct one-unit delimiters.");
  const stack: number[] = [],
    extra: number[] = [];
  for (let j = 0; j < i.text.length; j++) {
    if (i.text[j] === i.opener) stack.push(j);
    else if (i.text[j] === i.closer) {
      if (stack.length) stack.pop();
      else extra.push(j);
    }
  }
  return {
    unmatchedOpenOffsets: stack,
    unmatchedCloseOffsets: extra,
    minimumInsertions: stack.length + extra.length,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: ")(()", opener: "(", closer: ")" },
  output: {
    result: {
      unmatchedOpenOffsets: [1],
      unmatchedCloseOffsets: [0],
      minimumInsertions: 2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/delimiter-balance-single-pair-repair-hints",
  title: "Single Pair Delimiter Repair Hints",
  description:
    "Provide literal single-pair delimiter insertion hints with unmatched offsets; quotes, escapes and cross-type nesting are outside scope.",
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
