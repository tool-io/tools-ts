import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  occurrences,
} from "../batch53-shared.js";

export type Input = Readonly<{
  text: string;
  token: string;
  minimumSpaces: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "token", label: "Token", kind: "string" },
  { id: "minimumSpaces", label: "Minimum spaces", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.minimumSpaces, "spaces", 0, 128);
  return {
    matches: occurrences(i.text, i.token).map((offset) => {
      const left = i.text.slice(0, offset).match(/ *$/)![0].length,
        right = i.text.slice(offset + i.token.length).match(/^ */)![0].length;
      return {
        offset,
        leftSpaces: left,
        rightSpaces: right,
        leftPass: offset === 0 || left >= i.minimumSpaces,
        rightPass:
          offset + i.token.length === i.text.length || right >= i.minimumSpaces,
      };
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { text: "a + b", token: "+", minimumSpaces: 1 },
  output: {
    result: {
      matches: [
        {
          offset: 2,
          leftSpaces: 1,
          rightSpaces: 1,
          leftPass: true,
          rightPass: true,
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/literal-token-spacing-audit",
  title: "Literal Token Spacing Audit",
  description:
    "Audit ASCII-space runs around every overlapping literal token; document edges pass, tabs are not counted as spaces.",
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
