import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly tetradClasses: readonly string[];
}>;
export type Output = Readonly<{
  readonly parentalDitypes: number;
  readonly nonparentalDitypes: number;
  readonly tetratypes: number;
  readonly recombinationPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !input.tetradClasses.length ||
    input.tetradClasses.some((v) => !["PD", "NPD", "TT"].includes(v))
  )
    simpleError("tetradClasses", "Use PD, NPD or TT per scored tetrad.");
  const parentalDitypes = input.tetradClasses.filter((v) => v === "PD").length,
    nonparentalDitypes = input.tetradClasses.filter((v) => v === "NPD").length,
    tetratypes = input.tetradClasses.filter((v) => v === "TT").length;
  return {
    parentalDitypes,
    nonparentalDitypes,
    tetratypes,
    recombinationPercent:
      (100 * (nonparentalDitypes + tetratypes / 2)) /
      input.tetradClasses.length,
  };
};
export const exampleInput = {
  tetradClasses: ["PD", "PD", "NPD", "TT"],
} satisfies Input;
export const exampleOutput = {
  parentalDitypes: 2,
  nonparentalDitypes: 1,
  tetratypes: 1,
  recombinationPercent: 37.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/tetrad-segregation-tally",
  title: "Tetrad Segregation Tally",
  description:
    "Tally unordered tetrad classes and recombinant-product fraction.",
  inputs: [
    { id: "tetradClasses", label: "Tetrad classes", kind: "stringList" },
  ],
  outputs: [
    { id: "parentalDitypes", label: "Parental ditypes", kind: "number" },
    { id: "nonparentalDitypes", label: "Nonparental ditypes", kind: "number" },
    { id: "tetratypes", label: "Tetratypes", kind: "number" },
    {
      id: "recombinationPercent",
      label: "Recombination percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      tetradClasses: value.tetradClasses as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
