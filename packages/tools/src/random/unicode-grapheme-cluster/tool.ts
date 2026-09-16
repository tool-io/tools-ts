import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
  scalarText,
  repertoire,
} from "../batch53-shared.js";

export type Input = Readonly<{
  seed: string;
  count: number;
  withoutReplacement: boolean;
  candidateClusters: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  { id: "candidateClusters", label: "Candidate clusters", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.candidateClusters.length)
    simpleError("clusters", "Explicit nonempty cluster inventory.");
  const segmenter = new Intl.Segmenter("und", { granularity: "grapheme" });
  for (const v of i.candidateClusters) {
    scalarText(v);
    if (!v.length || [...segmenter.segment(v)].length !== 1)
      simpleError(
        "clusters",
        "One Unicode extended grapheme cluster per entry under the runtime Unicode edition.",
      );
  }
  unique(i.candidateClusters, "clusters");
  return repertoire(
    { values: i.candidateClusters },
    i.candidateClusters.length,
    i,
    context,
  ).result;
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    seed: "tool.io/batch53",
    count: 1,
    withoutReplacement: true,
    candidateClusters: ["👩‍💻"],
  },
  output: {
    result: { values: ["👩‍💻"], selectedEntryIndices: [0], repertoireSize: 1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/unicode-grapheme-cluster",
  title: "Random Unicode Grapheme Cluster Generator",
  description:
    "Sample explicit validated extended grapheme clusters using the existing repertoire sampler; segmentation follows the runtime Unicode edition, not one code point or an invented complete repertoire.",
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
