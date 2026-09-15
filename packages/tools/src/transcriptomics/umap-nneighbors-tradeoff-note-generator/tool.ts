import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  neighbors,
  exactLookup,
} from "../batch53-shared.js";

export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    reference: exactLookup(i.key, {
      "n-neighbors":
        "Smaller UMAP n_neighbors emphasizes local neighborhoods; larger values can preserve broader structure. Results also depend on metric, min_dist and sampling.",
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { key: "n-neighbors" },
  output: {
    result: {
      reference:
        "Smaller UMAP n_neighbors emphasizes local neighborhoods; larger values can preserve broader structure. Results also depend on metric, min_dist and sampling.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/umap-nneighbors-tradeoff-note-generator",
  title: "UMAP n-Neighbors Local-Global Tradeoff Note Generator",
  description:
    "Explain UMAP neighborhood tradeoffs without running an embedding. Bounded exact-key educational reference only; observations and applicability must be established independently.",
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
