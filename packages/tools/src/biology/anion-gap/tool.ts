import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const anionGapExample = {
  input: { bicarbonateMmolL: 24, chlorideMmolL: 104, sodiumMmolL: 140 },
  output: { anionGap: 12 },
} satisfies ToolExample<
  {
    readonly bicarbonateMmolL: number;
    readonly chlorideMmolL: number;
    readonly sodiumMmolL: number;
  },
  { readonly anionGap: number }
>;

export const anionGapTool = createSimpleTool({
  id: "biology/anion-gap",
  title: "Anion Gap",
  description:
    "Compute the serum anion gap from sodium, chloride, and bicarbonate.",
  inputs: [
    {
      id: "sodiumMmolL",
      kind: "number",
      label: "Sodium",
      minimum: Number.MIN_VALUE,
      unit: "mmol/L",
    },
    {
      id: "chlorideMmolL",
      kind: "number",
      label: "Chloride",
      minimum: Number.MIN_VALUE,
      unit: "mmol/L",
    },
    {
      id: "bicarbonateMmolL",
      kind: "number",
      label: "Bicarbonate",
      minimum: Number.MIN_VALUE,
      unit: "mmol/L",
    },
  ],
  outputs: [
    {
      id: "anionGap",
      kind: "number",
      label: "Anion gap",
      unit: "mmol/L",
    },
  ],
  calculate: (input) => ({
    anionGap:
      (input.sodiumMmolL as number) -
      ((input.chlorideMmolL as number) + (input.bicarbonateMmolL as number)),
  }),
});
export const runAnionGap = anionGapTool.execute;
export default anionGapTool;
