import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  span,
  edits,
  throughEdits,
} from "../batch53-shared.js";

export type Input = Readonly<{
  sourceLength: number;
  start: number;
  end: number;
  editsJson: string;
  startRightAffinity: boolean;
  endRightAffinity: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sourceLength", label: "Source length", kind: "number" },
  { id: "start", label: "Start", kind: "number" },
  { id: "end", label: "End", kind: "number" },
  { id: "editsJson", label: "Edits json", kind: "string" },
  { id: "startRightAffinity", label: "Start right affinity", kind: "boolean" },
  { id: "endRightAffinity", label: "End right affinity", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.sourceLength, "length", 0, 8192);
  span(i.start, i.end, i.sourceLength);
  const a = edits(i.editsJson, i.sourceLength),
    start = throughEdits(i.start, a, i.startRightAffinity),
    end = throughEdits(i.end, a, i.endRightAffinity);
  return { start, end, orientationReversed: start > end };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    sourceLength: 3,
    start: 1,
    end: 2,
    editsJson: '[{"start":1,"end":2,"text":"XY"}]',
    startRightAffinity: false,
    endRightAffinity: true,
  },
  output: { result: { start: 1, end: 3, orientationReversed: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "text/selection-through-edit-transform",
  title: "Selection Through Edit Transform",
  description:
    "Transform each selection endpoint with its stated affinity; preserve any resulting reversed orientation rather than silently swap endpoints.",
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
