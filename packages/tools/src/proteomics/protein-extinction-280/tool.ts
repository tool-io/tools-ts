import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly disulfideBondCount: number;
}>;
export type Output = Readonly<{
  readonly extinctionCoefficient: number;
  readonly trpCount: number;
  readonly tyrCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    cysteines = [...s].filter((v) => v === "C").length;
  if (
    !Number.isSafeInteger(input.disulfideBondCount) ||
    input.disulfideBondCount < 0 ||
    input.disulfideBondCount > Math.floor(cysteines / 2)
  )
    simpleError(
      "disulfideBondCount",
      "Bond count cannot exceed cysteine pairs.",
    );
  const trpCount = [...s].filter((v) => v === "W").length,
    tyrCount = [...s].filter((v) => v === "Y").length;
  return {
    extinctionCoefficient:
      5500 * trpCount + 1490 * tyrCount + 125 * input.disulfideBondCount,
    trpCount,
    tyrCount,
  };
};
export const exampleInput = {
  sequence: "WYCC",
  disulfideBondCount: 1,
} satisfies Input;
export const exampleOutput = {
  extinctionCoefficient: 7115,
  trpCount: 1,
  tyrCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-extinction-280",
  title: "Protein Extinction 280",
  description:
    "Estimate 280-nm molar extinction coefficient from Trp, Tyr, and cystine.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "disulfideBondCount", label: "Disulfide bond count", kind: "number" },
  ],
  outputs: [
    {
      id: "extinctionCoefficient",
      label: "Extinction coefficient",
      kind: "number",
    },
    { id: "trpCount", label: "Trp count", kind: "number" },
    { id: "tyrCount", label: "Tyr count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      disulfideBondCount: value.disulfideBondCount as number,
    }),
});
export const run = tool.execute;
export default tool;
