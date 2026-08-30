import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly donorMotifs: readonly string[];
  readonly acceptorMotifs: readonly string[];
  readonly minimumCanonicalPercent: number;
}>;
export type Output = Readonly<{
  readonly canonicalCount: number;
  readonly canonicalPercent: number;
  readonly passes: boolean;
}>;

export const calculate = (input: Input): Output => {
  const n = input.donorMotifs.length;
  if (n === 0 || n !== input.acceptorMotifs.length)
    simpleError("donorMotifs", "Aligned nonempty splice motifs required.");
  const canonicalCount = input.donorMotifs.filter(
      (v, i) =>
        v.toUpperCase() === "GT" &&
        input.acceptorMotifs[i].toUpperCase() === "AG",
    ).length,
    canonicalPercent = (canonicalCount / n) * 100;
  return {
    canonicalCount,
    canonicalPercent,
    passes: canonicalPercent >= input.minimumCanonicalPercent,
  };
};

export const exampleInput = {
  donorMotifs: ["GT", "GC", "GT"],
  acceptorMotifs: ["AG", "AG", "AC"],
  minimumCanonicalPercent: 50,
} satisfies Input;
export const exampleOutput = {
  canonicalCount: 1,
  canonicalPercent: 33.33333333333333,
  passes: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/canonical-splice-support",
  title: "Canonical Splice Support",
  description: "Count canonical GT–AG splice junction motifs.",
  inputs: [
    { id: "donorMotifs", kind: "stringList", label: "Donor motifs" },
    { id: "acceptorMotifs", kind: "stringList", label: "Acceptor motifs" },
    {
      id: "minimumCanonicalPercent",
      kind: "number",
      label: "Minimum canonical percent",
    },
  ],
  outputs: [
    { id: "canonicalCount", kind: "number", label: "Canonical count" },
    { id: "canonicalPercent", kind: "number", label: "Canonical percent" },
    { id: "passes", kind: "boolean", label: "Passes" },
  ],
  calculate: (value) =>
    calculate({
      donorMotifs: value.donorMotifs as readonly string[],
      acceptorMotifs: value.acceptorMotifs as readonly string[],
      minimumCanonicalPercent: value.minimumCanonicalPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
