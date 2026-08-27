import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PunnettSquareDiInput = {
  readonly cross: "aabb-cross";
};

export type PunnettSquareDiOutput = {
  readonly bothDominant: number;
  readonly bothRecessive: number;
  readonly singleDominant: number;
};

export const punnettSquareDiExample = {
  input: { cross: "aabb-cross" },
  output: {
    bothDominant: 0.5625,
    singleDominant: 0.375,
    bothRecessive: 0.0625,
  },
} satisfies ToolExample<PunnettSquareDiInput, PunnettSquareDiOutput>;

export const punnettSquareDiTool = createSimpleTool({
  id: "biology/punnett-square-di",
  title: "Dihybrid Ratio",
  description:
    "Report the classic 9:3:3:1 phenotypic fractions of an AaBb x AaBb dihybrid cross.",
  inputs: [
    {
      enum: ["aabb-cross"],
      id: "cross",
      kind: "string",
      label: "Cross type",
    },
  ],
  outputs: [
    {
      id: "bothDominant",
      label: "Both dominant traits",
      kind: "number",
    },
    {
      id: "singleDominant",
      label: "Exactly one dominant trait",
      kind: "number",
    },
    {
      id: "bothRecessive",
      label: "Both recessive traits",
      kind: "number",
    },
  ],
  calculate: () => ({
    bothDominant: 9 / 16,
    singleDominant: 3 / 16 + 3 / 16,
    bothRecessive: 1 / 16,
  }),
});
export const runPunnettSquareDi = punnettSquareDiTool.execute;
export default punnettSquareDiTool;
