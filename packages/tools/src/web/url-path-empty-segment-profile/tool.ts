import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch53-shared.js";

export type Input = Readonly<{ path: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "path", label: "Path", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (/[?#]/.test(i.path))
    simpleError("path", "Raw path component only, excluding query/fragment.");
  const a = i.path.split("/");
  return {
    segments: a,
    emptyIndexes: a.flatMap((v, j) => (v === "" ? [j] : [])),
    leadingSlash: i.path.startsWith("/"),
    trailingSlash: i.path.endsWith("/"),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { path: "/a//b/" },
  output: {
    result: {
      segments: ["", "a", "", "b", ""],
      emptyIndexes: [0, 2, 4],
      leadingSlash: true,
      trailingSlash: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/url-path-empty-segment-profile",
  title: "URL Path Empty Segment Profile",
  description:
    "Profile raw literal URL-path empty segments without URL normalization or decoding escaped slashes.",
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
