import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  binary,
  unique,
} from "../batch53-shared.js";

export type Input = Readonly<{
  nodeIds: readonly string[];
  yesTargets: readonly string[];
  noTargets: readonly string[];
  startNode: string;
  answers: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "nodeIds", label: "Node ids", kind: "stringList" },
  { id: "yesTargets", label: "Yes targets", kind: "stringList" },
  { id: "noTargets", label: "No targets", kind: "stringList" },
  { id: "startNode", label: "Start node", kind: "string" },
  { id: "answers", label: "Answers", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  aligned(i.nodeIds, i.yesTargets, "key");
  aligned(i.nodeIds, i.noTargets, "key");
  unique(i.nodeIds, "nodes");
  binary(i.answers, "answers");
  let current = i.startNode;
  const path = [current];
  for (const a of i.answers) {
    const j = i.nodeIds.indexOf(current);
    if (j < 0)
      simpleError("path", "No further couplet at terminal or missing node.");
    current = (a ? i.yesTargets : i.noTargets)[j];
    if (!current.trim()) simpleError("target", "Explicit branch target.");
    path.push(current);
  }
  return { path, currentNode: current, terminal: !i.nodeIds.includes(current) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    nodeIds: ["a"],
    yesTargets: ["species-x"],
    noTargets: ["species-y"],
    startNode: "a",
    answers: [1],
  },
  output: {
    result: {
      path: ["a", "species-x"],
      currentNode: "species-x",
      terminal: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mycology/fieldguide-key-path-tracker",
  title: "Field Guide Key Coupleta Path Resolution Step Tracker",
  description:
    "Track explicit binary field-guide couplet decisions; answers must be independently observed and terminal labels are not authenticated species identifications.",
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
