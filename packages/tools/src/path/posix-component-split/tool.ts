import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  components,
} from "../batch53-shared.js";

export type Input = Readonly<{ path: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "path", label: "Path", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (i.path.includes("\0")) simpleError("path", "NUL unsupported.");
  return {
    components: components(i.path),
    absolute: i.path.startsWith("/"),
    trailingSeparator: i.path.endsWith("/"),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { path: "/a//b/" },
  output: {
    result: { components: ["a", "b"], absolute: true, trailingSeparator: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/posix-component-split",
  title: "POSIX Path Component Splitter",
  description:
    "Split lexical POSIX slash components, collapsing empty components but retaining absolute/trailing-separator flags; no filesystem access.",
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
