import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MorishitaIndexInput = {
  readonly countA: number;
  readonly countB: number;
  readonly countC: number;
};

export type MorishitaIndexOutput = {
  readonly morishitaIndex: number;
};

export const morishitaIndexExample = {
  input: { countA: 4, countB: 4, countC: 2 },
  output: { morishitaIndex: 0.8666666666666667 },
} satisfies ToolExample<MorishitaIndexInput, MorishitaIndexOutput>;

export const morishitaIndexTool = createSimpleTool({
  id: "biology/morishita-index",
  title: "Morishita Index",
  description:
    "Compute Morisita's dispersion index from three quadrat counts as 3 × Σni(ni − 1) divided by N(N − 1).",
  inputs: [
    {
      id: "countA",
      kind: "integer",
      label: "Quadrat A count",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "countB",
      kind: "integer",
      label: "Quadrat B count",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "countC",
      kind: "integer",
      label: "Quadrat C count",
      minimum: 0,
      unit: "individuals",
    },
  ],
  outputs: [
    {
      id: "morishitaIndex",
      kind: "number",
      label: "Morishita index",
    },
  ],
  calculate: (input) => {
    const counts = [
      input.countA as number,
      input.countB as number,
      input.countC as number,
    ];
    const total = counts[0] + counts[1] + counts[2];
    if (!(total > 1))
      simpleError(
        "countA",
        "More than one individual in total is required.",
        "insufficient_samples",
      );
    let sumCountPairs = 0;
    for (const count of counts)
      if (count > 0) sumCountPairs += count * (count - 1);
    return {
      morishitaIndex: (counts.length * sumCountPairs) / (total * (total - 1)),
    };
  },
});
export const runMorishitaIndex = morishitaIndexTool.execute;
export default morishitaIndexTool;
