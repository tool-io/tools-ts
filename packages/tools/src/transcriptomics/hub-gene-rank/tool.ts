import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly geneIds: readonly string[];
  readonly connectivities: readonly number[];
  readonly topCount: number;
}>;
export type Output = Readonly<{
  readonly topGeneIds: readonly string[];
  readonly topConnectivities: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  if (
    input.geneIds.length === 0 ||
    input.geneIds.length !== input.connectivities.length ||
    input.topCount < 1 ||
    input.topCount > input.geneIds.length
  )
    simpleError("geneIds", "Aligned genes and a valid top count are required.");
  const order = input.connectivities
    .map((v, i) => i)
    .sort((a, b) => input.connectivities[b] - input.connectivities[a] || a - b)
    .slice(0, input.topCount);
  return {
    topGeneIds: order.map((i) => input.geneIds[i]),
    topConnectivities: order.map((i) => input.connectivities[i]),
  };
};

export const exampleInput = {
  geneIds: ["a", "b", "c"],
  connectivities: [0.1, 0.8, 0.4],
  topCount: 2,
} satisfies Input;
export const exampleOutput = {
  topGeneIds: ["b", "c"],
  topConnectivities: [0.8, 0.4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/hub-gene-rank",
  title: "Hub Gene Rank",
  description: "Rank module genes by supplied eigengene connectivity.",
  inputs: [
    { id: "geneIds", kind: "stringList", label: "Gene ids" },
    { id: "connectivities", kind: "numberList", label: "Connectivities" },
    { id: "topCount", kind: "number", label: "Top count" },
  ],
  outputs: [
    { id: "topGeneIds", kind: "stringList", label: "Top gene ids" },
    {
      id: "topConnectivities",
      kind: "numberList",
      label: "Top connectivities",
    },
  ],
  calculate: (value) =>
    calculate({
      geneIds: value.geneIds as readonly string[],
      connectivities: value.connectivities as readonly number[],
      topCount: value.topCount as number,
    }),
});
export const run = tool.execute;
export default tool;
