import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly substrateMeltArea: number;
  readonly depositedMeltArea: number;
}>;
export type Output = Readonly<{
  readonly dilutionPercent: number;
  readonly totalMeltArea: number;
}>;

export const calculate = (input: Input): Output => {
  const totalMeltArea = input.substrateMeltArea + input.depositedMeltArea;
  if (totalMeltArea <= 0)
    simpleError(
      "substrateMeltArea",
      "Total melt area must be positive.",
      "zero_area",
    );
  return {
    dilutionPercent: (input.substrateMeltArea / totalMeltArea) * 100,
    totalMeltArea,
  };
};

export const exampleInput = {
  substrateMeltArea: 2,
  depositedMeltArea: 8,
} satisfies Input;
export const exampleOutput = {
  dilutionPercent: 20,
  totalMeltArea: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      substrateMeltArea: input.substrateMeltArea as number,
      depositedMeltArea: input.depositedMeltArea as number,
    }),
  description:
    "Calculate cladding dilution as substrate melt area divided by total melt area.",
  id: "laser/cladding-dilution",
  inputs: [
    {
      id: "substrateMeltArea",
      label: "Substrate melt area",
      kind: "number",
      minimum: 0,
      unit: "area",
    },
    {
      id: "depositedMeltArea",
      label: "Deposited material area",
      kind: "number",
      minimum: 0,
      unit: "area",
    },
  ],
  outputs: [
    {
      id: "dilutionPercent",
      label: "Substrate dilution",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "totalMeltArea",
      label: "Total melt area",
      kind: "number",
      minimum: 0,
      unit: "area",
    },
  ],
  title: "Cladding Dilution",
});

export const run = tool.execute;
export default tool;
