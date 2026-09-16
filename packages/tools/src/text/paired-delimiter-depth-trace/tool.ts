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
    simpleError("delimiter", "Distinct single UTF-16-unit delimiters.");
  let depth = 0;
  const trace: {
    offset: number;
    delimiter: string;
    depth: number;
    unmatchedClose: boolean;
  }[] = [];
  for (let j = 0; j < i.text.length; j++) {
    const c = i.text[j];
    if (c === i.opener) {
      depth++;
      trace.push({ offset: j, delimiter: c, depth, unmatchedClose: false });
    } else if (c === i.closer) {
      const unmatchedClose = depth === 0;
      if (depth) depth--;
      trace.push({ offset: j, delimiter: c, depth, unmatchedClose });
    }
  }
  return { trace, unclosedOpeners: depth };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "(a)", opener: "(", closer: ")" },
  output: {
    result: {
      trace: [
        { offset: 0, delimiter: "(", depth: 1, unmatchedClose: false },
        { offset: 2, delimiter: ")", depth: 0, unmatchedClose: false },
      ],
      unclosedOpeners: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/paired-delimiter-depth-trace",
  title: "Paired Delimiter Depth Trace",
  description:
    "Trace one literal delimiter pair outside any language grammar; quotes, escapes and comments are not interpreted.",
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
