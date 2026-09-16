import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  edgesJson: string;
  walk: readonly string[];
  directed: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "edgesJson", kind: "string", label: "edgesJson" },
  { id: "walk", kind: "stringList", label: "walk" },
  { id: "directed", kind: "boolean", label: "directed" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const e = H.edges(i.edgesJson);
  const missingSteps = i.walk
    .slice(1)
    .flatMap((v, j) =>
      e.some(
        (x) =>
          (x.source === i.walk[j] && x.target === v) ||
          (!i.directed && x.target === i.walk[j] && x.source === v),
      )
        ? []
        : [j],
    );
  return H.finish({ valid: missingSteps.length === 0, missingSteps });
};
export const example = {
  input: {
    edgesJson:
      '[{"id":"a","source":"u","target":"v","weight":2},{"id":"b","source":"v","target":"u","weight":4},{"id":"c","source":"u","target":"u","weight":1}]',
    walk: ["u", "v", "u"],
    directed: true,
  },
  output: { result: { valid: true, missingSteps: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "graph/edge-list-walk-validity",
  title: "Edge List Walk Validity Check",
  description:
    "Verify consecutive vertex transitions against explicit directed or undirected edge observations; repeated vertices and edges are allowed in a walk.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
