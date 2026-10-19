import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, collapse } from "../batch53-shared.js";

export type Input = Readonly<{ path: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "path", label: "Path", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return collapse(i.path);
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { path: "a/../b" },
  output: {
    result: {
      components: ["b"],
      events: [
        { index: 0, component: "a", action: "push" },
        { index: 1, component: "..", action: "pop" },
        { index: 2, component: "b", action: "push" },
      ],
      absolute: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/posix-dot-collapse-trace",
  title: "POSIX Dot Collapse Trace",
  description:
    "Trace lexical POSIX dot collapse, retaining unresolved leading parents on relative paths and clamping absolute root; symlinks are not resolved.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          components: { type: "array", items: { type: "string" } },
          events: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                component: { type: "string" },
                action: { type: "string" },
              },
              required: ["index", "component", "action"],
            },
          },
          absolute: { type: "boolean" },
        },
        required: ["components", "events", "absolute"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
