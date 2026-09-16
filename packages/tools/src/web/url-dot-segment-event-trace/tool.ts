import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, urlDotTrace } from "../batch53-shared.js";

export type Input = Readonly<{ path: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "path", label: "Path", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => urlDotTrace(i.path);
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { path: "/a/./b/../c" },
  output: {
    result: {
      normalizedPath: "/a/c",
      events: [
        { action: "move", segment: "/a", removed: null },
        { action: "remove-dot", segment: "/.", removed: null },
        { action: "move", segment: "/b", removed: null },
        { action: "remove-parent", segment: "/..", removed: "/b" },
        { action: "move", segment: "/c", removed: null },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/url-dot-segment-event-trace",
  title: "URL Dot Segment Event Trace",
  description:
    "Trace RFC 3986 section 5.2.4 literal URL dot-segment removal, preserving meaningful empty slash segments. Percent-encoded dots and slashes remain opaque; not complete URI reference resolution, authorization or filesystem traversal protection.",
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
