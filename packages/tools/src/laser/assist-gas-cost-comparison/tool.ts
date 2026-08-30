import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nitrogenFlowUnitsPerHour: number;
  readonly nitrogenUnitCost: number;
  readonly nitrogenCutHours: number;
  readonly oxygenFlowUnitsPerHour: number;
  readonly oxygenUnitCost: number;
  readonly oxygenCutHours: number;
  readonly nitrogenReworkCost: number;
  readonly oxygenReworkCost: number;
}>;
export type Output = Readonly<{
  readonly nitrogenTotalCost: number;
  readonly oxygenTotalCost: number;
  readonly costDifference: number;
  readonly lowerCostGas: string;
}>;

export const calculate = (input: Input): Output => {
  const nitrogenTotalCost =
    input.nitrogenFlowUnitsPerHour *
      input.nitrogenUnitCost *
      input.nitrogenCutHours +
    input.nitrogenReworkCost;
  const oxygenTotalCost =
    input.oxygenFlowUnitsPerHour * input.oxygenUnitCost * input.oxygenCutHours +
    input.oxygenReworkCost;
  return {
    nitrogenTotalCost,
    oxygenTotalCost,
    costDifference: oxygenTotalCost - nitrogenTotalCost,
    lowerCostGas:
      nitrogenTotalCost === oxygenTotalCost
        ? "tie"
        : nitrogenTotalCost < oxygenTotalCost
          ? "nitrogen"
          : "oxygen",
  };
};

export const exampleInput = {
  nitrogenFlowUnitsPerHour: 10,
  nitrogenUnitCost: 2,
  nitrogenCutHours: 1,
  oxygenFlowUnitsPerHour: 5,
  oxygenUnitCost: 1,
  oxygenCutHours: 1,
  nitrogenReworkCost: 0,
  oxygenReworkCost: 20,
} satisfies Input;
export const exampleOutput = {
  nitrogenTotalCost: 20,
  oxygenTotalCost: 25,
  costDifference: 5,
  lowerCostGas: "nitrogen",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      nitrogenFlowUnitsPerHour: input.nitrogenFlowUnitsPerHour as number,
      nitrogenUnitCost: input.nitrogenUnitCost as number,
      nitrogenCutHours: input.nitrogenCutHours as number,
      oxygenFlowUnitsPerHour: input.oxygenFlowUnitsPerHour as number,
      oxygenUnitCost: input.oxygenUnitCost as number,
      oxygenCutHours: input.oxygenCutHours as number,
      nitrogenReworkCost: input.nitrogenReworkCost as number,
      oxygenReworkCost: input.oxygenReworkCost as number,
    }),
  description:
    "Compare caller-supplied assist-gas consumption and rework costs.",
  id: "laser/assist-gas-cost-comparison",
  inputs: [
    {
      id: "nitrogenFlowUnitsPerHour",
      label: "Nitrogen flow",
      kind: "number",
      minimum: 0,
    },
    {
      id: "nitrogenUnitCost",
      label: "Nitrogen unit cost",
      kind: "number",
      minimum: 0,
    },
    {
      id: "nitrogenCutHours",
      label: "Nitrogen cutting time",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "oxygenFlowUnitsPerHour",
      label: "Oxygen flow",
      kind: "number",
      minimum: 0,
    },
    {
      id: "oxygenUnitCost",
      label: "Oxygen unit cost",
      kind: "number",
      minimum: 0,
    },
    {
      id: "oxygenCutHours",
      label: "Oxygen cutting time",
      kind: "number",
      minimum: 0,
      unit: "h",
    },
    {
      id: "nitrogenReworkCost",
      label: "Nitrogen rework cost",
      kind: "number",
      minimum: 0,
    },
    {
      id: "oxygenReworkCost",
      label: "Oxygen rework cost",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "nitrogenTotalCost",
      label: "Nitrogen scenario cost",
      kind: "number",
      minimum: 0,
    },
    {
      id: "oxygenTotalCost",
      label: "Oxygen scenario cost",
      kind: "number",
      minimum: 0,
    },
    {
      id: "costDifference",
      label: "Oxygen minus nitrogen cost",
      kind: "number",
    },
    {
      id: "lowerCostGas",
      label: "Lower-cost scenario",
      kind: "string",
      enum: ["nitrogen", "oxygen", "tie"],
    },
  ],
  title: "Assist-Gas Cost Comparison",
});

export const run = tool.execute;
export default tool;
