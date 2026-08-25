import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BunCreatinineRatioInput = {
  readonly bunMgDl: number;
  readonly creatinineMgDl: number;
};

export type BunCreatinineRatioOutput = {
  readonly bunCreatinineRatio: number;
};

export const bunCreatinineRatioExample = {
  input: { bunMgDl: 14, creatinineMgDl: 1 },
  output: { bunCreatinineRatio: 14 },
} satisfies ToolExample<BunCreatinineRatioInput, BunCreatinineRatioOutput>;

export const bunCreatinineRatioTool = createSimpleTool({
  id: "biology/bun-creatinine-ratio",
  title: "BUN Creatinine Ratio",
  description: "Compute the blood urea nitrogen to serum creatinine ratio.",
  inputs: [
    {
      id: "bunMgDl",
      kind: "number",
      label: "BUN",
      minimum: 0,
      unit: "mg/dL",
    },
    {
      id: "creatinineMgDl",
      kind: "number",
      label: "Creatinine",
      minimum: Number.MIN_VALUE,
      unit: "mg/dL",
    },
  ],
  outputs: [
    {
      id: "bunCreatinineRatio",
      kind: "number",
      label: "BUN creatinine ratio",
    },
  ],
  calculate: (input) => ({
    bunCreatinineRatio:
      (input.bunMgDl as number) / (input.creatinineMgDl as number),
  }),
});
export const runBunCreatinineRatio = bunCreatinineRatioTool.execute;
export default bunCreatinineRatioTool;
