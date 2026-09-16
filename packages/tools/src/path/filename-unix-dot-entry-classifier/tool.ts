import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{ name: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "name", label: "Name", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    classification:
      i.name === "."
        ? "current-directory-entry"
        : i.name === ".."
          ? "parent-directory-entry"
          : i.name.startsWith(".")
            ? "other-dot-prefixed-name"
            : "other-name",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { name: ".hidden" },
  output: { result: { classification: "other-dot-prefixed-name" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "path/filename-unix-dot-entry-classifier",
  title: "Unix Dot Entry Classifier",
  description:
    "Classify exact Unix dot entries separately from dot-prefixed names; no filesystem lookup or hidden-attribute guarantee.",
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
