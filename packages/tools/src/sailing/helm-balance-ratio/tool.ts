import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HelmBalanceRatioInput = {
  readonly ceForwardOfClDistanceMeters: number;
  readonly loaMeters: number;
};

export type HelmBalanceRatioOutput = {
  readonly balancePercent: number;
};

export const helmBalanceRatioExample = {
  input: { ceForwardOfClDistanceMeters: 0.6, loaMeters: 12 },
  output: { balancePercent: 5 },
} satisfies ToolExample<HelmBalanceRatioInput, HelmBalanceRatioOutput>;

export const helmBalanceRatioTool = createSimpleTool({
  calculate: (input) => {
    const ceForwardOfClDistanceMeters =
      input.ceForwardOfClDistanceMeters as number;
    const loaMeters = input.loaMeters as number;
    if (loaMeters <= 0)
      simpleError("loaMeters", "LOA must be positive.", "invalid_loa");
    return {
      balancePercent: (ceForwardOfClDistanceMeters / loaMeters) * 100,
    };
  },
  description:
    "Express the signed longitudinal separation between sail-plan center of effort and center of lateral resistance as a percentage of length overall.",
  id: "sailing/helm-balance-ratio",
  inputs: [
    {
      description:
        "Signed distance from the centre of lateral resistance to the centre of effort, positive when the CE is forward.",
      id: "ceForwardOfClDistanceMeters",
      kind: "number",
      label: "CE forward of CLR",
      unit: "m",
    },
    {
      description: "Length overall of the vessel.",
      id: "loaMeters",
      kind: "number",
      label: "LOA",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      description:
        "Signed separation percentage; interpret helm tendency with the vessel's coordinate convention and full sail-plan geometry.",
      id: "balancePercent",
      kind: "number",
      label: "Balance percentage",
      unit: "%",
    },
  ],
  title: "Helm Balance Ratio",
});
export const runHelmBalanceRatio = helmBalanceRatioTool.execute;
export default helmBalanceRatioTool;
