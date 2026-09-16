import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  edits,
  throughEdits,
} from "../batch53-shared.js";

export type Input = Readonly<{
  sourceLength: number;
  offset: number;
  editsJson: string;
  rightAffinity: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sourceLength", label: "Source length", kind: "number" },
  { id: "offset", label: "Offset", kind: "number" },
  { id: "editsJson", label: "Edits json", kind: "string" },
  { id: "rightAffinity", label: "Right affinity", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.sourceLength, "length", 0, 8192);
  bounded(i.offset, "offset", 0, i.sourceLength);
  const a = edits(i.editsJson, i.sourceLength);
  return { transformedOffset: throughEdits(i.offset, a, i.rightAffinity) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    sourceLength: 3,
    offset: 1,
    editsJson: '[{"start":1,"end":2,"text":"XY"}]',
    rightAffinity: true,
  },
  output: { result: { transformedOffset: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/offset-through-edit-transform",
  title: "Offset Through Edit Transform",
  description:
    "Transform an original offset through nonoverlapping edits; offsets at or inside replaced spans map to start or end by explicit affinity.",
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
