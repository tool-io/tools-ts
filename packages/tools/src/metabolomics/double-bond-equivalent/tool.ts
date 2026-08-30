import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly carbon: number;
  readonly hydrogen: number;
  readonly nitrogen: number;
  readonly halogens: number;
}>;
export type Output = Readonly<{
  readonly dbe: number;
  readonly formulaValid: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    [input.carbon, input.hydrogen, input.nitrogen, input.halogens].some(
      (v) => !Number.isSafeInteger(v) || v < 0,
    )
  )
    simpleError("carbon", "Nonnegative integer atom counts required.");
  const dbe =
    1 +
    input.carbon -
    input.hydrogen / 2 +
    input.nitrogen / 2 -
    input.halogens / 2;
  return { dbe, formulaValid: dbe >= 0 && Number.isInteger(dbe) };
};
export const exampleInput = {
  carbon: 6,
  hydrogen: 6,
  nitrogen: 0,
  halogens: 0,
} satisfies Input;
export const exampleOutput = { dbe: 4, formulaValid: true } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/double-bond-equivalent",
  title: "Double Bond Equivalent",
  description:
    "Calculate molecular double-bond equivalents from C/H/N/halogen counts.",
  inputs: [
    { id: "carbon", kind: "number", label: "Carbon" },
    { id: "hydrogen", kind: "number", label: "Hydrogen" },
    { id: "nitrogen", kind: "number", label: "Nitrogen" },
    { id: "halogens", kind: "number", label: "Halogens" },
  ],
  outputs: [
    { id: "dbe", kind: "number", label: "Dbe" },
    { id: "formulaValid", kind: "boolean", label: "Formula valid" },
  ],
  calculate: (value) =>
    calculate({
      carbon: value.carbon as number,
      hydrogen: value.hydrogen as number,
      nitrogen: value.nitrogen as number,
      halogens: value.halogens as number,
    }),
});
export const run = tool.execute;
export default tool;
