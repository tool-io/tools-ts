import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, fraction } from "../shared.js";

export type Input = Readonly<{
  readonly stockPfuPerMl: number;
  readonly inoculumVolumeMl: number;
  readonly dilutionFraction: number;
  readonly targetMoi: number;
}>;
export type Output = Readonly<{
  readonly targetCellCount: number;
  readonly deliveredPfu: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.stockPfuPerMl, "stockPfuPerMl");
  positive(input.inoculumVolumeMl, "inoculumVolumeMl");
  fraction(input.dilutionFraction, "dilutionFraction");
  positive(input.targetMoi, "targetMoi");
  const deliveredPfu =
    input.stockPfuPerMl * input.inoculumVolumeMl * input.dilutionFraction;
  return { targetCellCount: deliveredPfu / input.targetMoi, deliveredPfu };
};
export const exampleInput = {
  stockPfuPerMl: 1000000,
  inoculumVolumeMl: 0.1,
  dilutionFraction: 0.5,
  targetMoi: 2,
} satisfies Input;
export const exampleOutput = {
  targetCellCount: 25000,
  deliveredPfu: 50000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/cells-for-inoculum-moi",
  title: "Cells For Inoculum MOI",
  description:
    "Solve the target cell count for a specified infectious stock, inoculum volume, dilution, and MOI; physical particles are not substituted for PFU.",
  inputs: [
    {
      id: "stockPfuPerMl",
      label: "Stock pfu per ml",
      kind: "number",
      minimum: 0,
    },
    { id: "inoculumVolumeMl", label: "Inoculum volume ml", kind: "number" },
    {
      id: "dilutionFraction",
      label: "Dilution fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    { id: "targetMoi", label: "Target moi", kind: "number" },
  ],
  outputs: [
    { id: "targetCellCount", label: "Target cell count", kind: "number" },
    { id: "deliveredPfu", label: "Delivered pfu", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      stockPfuPerMl: value.stockPfuPerMl as number,
      inoculumVolumeMl: value.inoculumVolumeMl as number,
      dilutionFraction: value.dilutionFraction as number,
      targetMoi: value.targetMoi as number,
    }),
});
export const run = tool.execute;
export default tool;
