import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly plateauPfuPerMl: number;
  readonly baselinePfuPerMl: number;
  readonly infectedCellsPerMl: number;
}>;
export type Output = Readonly<{
  readonly netProgenyPfuPerMl: number;
  readonly burstPfuPerInfectedCell: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.plateauPfuPerMl, "plateauPfuPerMl");
  nonnegative(input.baselinePfuPerMl, "baselinePfuPerMl");
  positive(input.infectedCellsPerMl, "infectedCellsPerMl");
  if (input.plateauPfuPerMl < input.baselinePfuPerMl)
    simpleError(
      "plateauPfuPerMl",
      "Plateau titer cannot be below the measured inoculum background.",
    );
  const netProgenyPfuPerMl = input.plateauPfuPerMl - input.baselinePfuPerMl;
  return {
    netProgenyPfuPerMl,
    burstPfuPerInfectedCell: netProgenyPfuPerMl / input.infectedCellsPerMl,
  };
};
export const exampleInput = {
  plateauPfuPerMl: 1100,
  baselinePfuPerMl: 100,
  infectedCellsPerMl: 10,
} satisfies Input;
export const exampleOutput = {
  netProgenyPfuPerMl: 1000,
  burstPfuPerInfectedCell: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/one-step-burst-yield",
  title: "One Step Burst Yield",
  description:
    "Estimate background-subtracted infectious progeny per infected cell from a single-step growth plateau.",
  inputs: [
    {
      id: "plateauPfuPerMl",
      label: "Plateau pfu per ml",
      kind: "number",
      minimum: 0,
    },
    {
      id: "baselinePfuPerMl",
      label: "Baseline pfu per ml",
      kind: "number",
      minimum: 0,
    },
    {
      id: "infectedCellsPerMl",
      label: "Infected cells per ml",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "netProgenyPfuPerMl",
      label: "Net progeny pfu per ml",
      kind: "number",
    },
    {
      id: "burstPfuPerInfectedCell",
      label: "Burst pfu per infected cell",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      plateauPfuPerMl: value.plateauPfuPerMl as number,
      baselinePfuPerMl: value.baselinePfuPerMl as number,
      infectedCellsPerMl: value.infectedCellsPerMl as number,
    }),
});
export const run = tool.execute;
export default tool;
