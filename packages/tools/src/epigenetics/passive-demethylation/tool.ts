import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly initialMethylationPercent: number;
  readonly cellDivisions: number;
  readonly maintenanceFidelityPercent: number;
}>;
export type Output = Readonly<{
  readonly retainedMethylationPercent: number;
  readonly lostMethylationPoints: number;
}>;

export const calculate = (input: Input): Output => {
  const retainedMethylationPercent =
    input.initialMethylationPercent *
    (input.maintenanceFidelityPercent / 100) ** input.cellDivisions;
  return {
    retainedMethylationPercent,
    lostMethylationPoints:
      input.initialMethylationPercent - retainedMethylationPercent,
  };
};

export const exampleInput = {
  initialMethylationPercent: 80,
  cellDivisions: 2,
  maintenanceFidelityPercent: 50,
} satisfies Input;
export const exampleOutput = {
  retainedMethylationPercent: 20,
  lostMethylationPoints: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      initialMethylationPercent: input.initialMethylationPercent as number,
      cellDivisions: input.cellDivisions as number,
      maintenanceFidelityPercent: input.maintenanceFidelityPercent as number,
    }),
  description: "Model passive methylation dilution across divisions.",
  id: "epigenetics/passive-demethylation",
  inputs: [
    {
      id: "initialMethylationPercent",
      label: "Initial methylation",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
    {
      id: "cellDivisions",
      label: "Cell divisions",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "maintenanceFidelityPercent",
      label: "Maintenance fidelity",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "retainedMethylationPercent",
      label: "Retained methylation",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
    {
      id: "lostMethylationPoints",
      label: "Lost methylation",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Passive Demethylation",
});

export const run = tool.execute;
export default tool;
