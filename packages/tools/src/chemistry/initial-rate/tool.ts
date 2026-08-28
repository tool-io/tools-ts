import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const initialRateTool = createSimpleTool({
  id: "chemistry/initial-rate",
  title: "Initial Rate Calculator",
  description: "Calculate initial rate calculator.",
  inputs: [
    {
      description: "Rate constant.",
      id: "rateConstantK",
      kind: "number",
      label: "k",
      minimum: 0,
    },
    {
      description: "Concentration A.",
      id: "concentrationA",
      kind: "number",
      label: "[A]",
      minimum: 0,
    },
    {
      description: "Reaction order A.",
      id: "orderA",
      kind: "integer",
      label: "Order A",
      minimum: 0,
    },
    {
      description: "Concentration B.",
      id: "concentrationB",
      kind: "number",
      label: "[B]",
      minimum: 0,
    },
    {
      description: "Reaction order B.",
      id: "orderB",
      kind: "integer",
      label: "Order B",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Initial reaction rate.",
      id: "initialRateMolLs",
      kind: "number",
      label: "Initial rate",
    },
  ],
  calculate: (input) => {
    return {
      initialRateMolLs:
        (input.rateConstantK as number) *
        (input.concentrationA as number) ** (input.orderA as number) *
        (input.concentrationB as number) ** (input.orderB as number),
    };
  },
});
export default initialRateTool;
export const runInitialRate = initialRateTool.execute;

export type InitialRateInput = {
  readonly rateConstantK: number;
  readonly concentrationA: number;
  readonly orderA: number;
  readonly concentrationB: number;
  readonly orderB: number;
};

export type InitialRateOutput = {
  readonly initialRateMolLs: number;
};

export const initialRateExample = {
  input: {
    rateConstantK: 1,
    concentrationA: 1,
    orderA: 1,
    concentrationB: 1,
    orderB: 1,
  },
  output: {
    initialRateMolLs: 1,
  },
} satisfies ToolExample<InitialRateInput, InitialRateOutput>;
