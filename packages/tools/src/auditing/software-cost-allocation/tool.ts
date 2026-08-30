import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly researchCosts: number;
  readonly developmentCosts: number;
  readonly maintenanceCosts: number;
  readonly eligibleDevelopmentPercent: number;
}>;
export type Output = Readonly<{
  readonly capitalizedCosts: number;
  readonly expensedCosts: number;
  readonly capitalizationPercent: number;
}>;

export const calculate = (input: Input): Output => {
  const capitalizedCosts =
      (input.developmentCosts * input.eligibleDevelopmentPercent) / 100,
    total =
      input.researchCosts + input.developmentCosts + input.maintenanceCosts,
    expensedCosts = total - capitalizedCosts;
  return {
    capitalizedCosts,
    expensedCosts,
    capitalizationPercent: total === 0 ? 0 : (capitalizedCosts / total) * 100,
  };
};

export const exampleInput = {
  researchCosts: 100,
  developmentCosts: 600,
  maintenanceCosts: 300,
  eligibleDevelopmentPercent: 50,
} satisfies Input;
export const exampleOutput = {
  capitalizedCosts: 300,
  expensedCosts: 700,
  capitalizationPercent: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      researchCosts: input.researchCosts as number,
      developmentCosts: input.developmentCosts as number,
      maintenanceCosts: input.maintenanceCosts as number,
      eligibleDevelopmentPercent: input.eligibleDevelopmentPercent as number,
    }),
  description:
    "Allocate software costs between capitalized and expensed amounts.",
  id: "auditing/software-cost-allocation",
  inputs: [
    {
      id: "researchCosts",
      label: "Research-phase costs",
      kind: "number",
      minimum: 0,
    },
    {
      id: "developmentCosts",
      label: "Development-phase costs",
      kind: "number",
      minimum: 0,
    },
    {
      id: "maintenanceCosts",
      label: "Maintenance-phase costs",
      kind: "number",
      minimum: 0,
    },
    {
      id: "eligibleDevelopmentPercent",
      label: "Eligible development percentage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "capitalizedCosts",
      label: "Capitalized software costs",
      kind: "number",
      minimum: 0,
    },
    {
      id: "expensedCosts",
      label: "Expensed software costs",
      kind: "number",
      minimum: 0,
    },
    {
      id: "capitalizationPercent",
      label: "Capitalization share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Software Cost Allocation",
});

export const run = tool.execute;
export default tool;
