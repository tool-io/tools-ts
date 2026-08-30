import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly urinaryAnalyteUmolL: number;
  readonly urinaryCreatinineMmolL: number;
}>;
export type Output = Readonly<{
  readonly umolPerMmolCreatinine: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.urinaryAnalyteUmolL < 0 || input.urinaryCreatinineMmolL <= 0)
    simpleError(
      "urinaryCreatinineMmolL",
      "Creatinine concentration must be positive.",
    );
  return {
    umolPerMmolCreatinine:
      input.urinaryAnalyteUmolL / input.urinaryCreatinineMmolL,
  };
};
export const exampleInput = {
  urinaryAnalyteUmolL: 20,
  urinaryCreatinineMmolL: 2,
} satisfies Input;
export const exampleOutput = { umolPerMmolCreatinine: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/creatinine-normalized-excretion",
  title: "Creatinine Normalized Excretion",
  description: "Normalize urinary metabolite concentration to creatinine.",
  inputs: [
    {
      id: "urinaryAnalyteUmolL",
      kind: "number",
      label: "Urinary analyte umol l",
    },
    {
      id: "urinaryCreatinineMmolL",
      kind: "number",
      label: "Urinary creatinine mmol l",
    },
  ],
  outputs: [
    {
      id: "umolPerMmolCreatinine",
      kind: "number",
      label: "Umol per mmol creatinine",
    },
  ],
  calculate: (value) =>
    calculate({
      urinaryAnalyteUmolL: value.urinaryAnalyteUmolL as number,
      urinaryCreatinineMmolL: value.urinaryCreatinineMmolL as number,
    }),
});
export const run = tool.execute;
export default tool;
