import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly gaapEquity: number;
  readonly nonadmittedAssetAdjustment: number;
  readonly reserveAdjustment: number;
  readonly otherStatutoryAdjustments: number;
}>;
export type Output = Readonly<{
  readonly totalStatutoryAdjustments: number;
  readonly statutorySurplus: number;
  readonly surplusDifference: number;
}>;

export const calculate = (input: Input): Output => {
  const totalStatutoryAdjustments =
      input.nonadmittedAssetAdjustment +
      input.reserveAdjustment +
      input.otherStatutoryAdjustments,
    statutorySurplus = input.gaapEquity + totalStatutoryAdjustments;
  return {
    totalStatutoryAdjustments,
    statutorySurplus,
    surplusDifference: statutorySurplus - input.gaapEquity,
  };
};

export const exampleInput = {
  gaapEquity: 1000,
  nonadmittedAssetAdjustment: -100,
  reserveAdjustment: -50,
  otherStatutoryAdjustments: 20,
} satisfies Input;
export const exampleOutput = {
  totalStatutoryAdjustments: -130,
  statutorySurplus: 870,
  surplusDifference: -130,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      gaapEquity: input.gaapEquity as number,
      nonadmittedAssetAdjustment: input.nonadmittedAssetAdjustment as number,
      reserveAdjustment: input.reserveAdjustment as number,
      otherStatutoryAdjustments: input.otherStatutoryAdjustments as number,
    }),
  description:
    "Bridge GAAP equity to statutory surplus using supplied adjustments.",
  id: "insurance/sap-gaap-surplus-bridge",
  inputs: [
    { id: "gaapEquity", label: "GAAP equity", kind: "number", minimum: 0 },
    {
      id: "nonadmittedAssetAdjustment",
      label: "Nonadmitted asset adjustment",
      kind: "number",
    },
    { id: "reserveAdjustment", label: "Reserve adjustment", kind: "number" },
    {
      id: "otherStatutoryAdjustments",
      label: "Other statutory adjustments",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "totalStatutoryAdjustments",
      label: "Total statutory adjustments",
      kind: "number",
    },
    { id: "statutorySurplus", label: "Statutory surplus", kind: "number" },
    {
      id: "surplusDifference",
      label: "Statutory minus GAAP surplus",
      kind: "number",
    },
  ],
  title: "SAP–GAAP Surplus Bridge",
});

export const run = tool.execute;
export default tool;
