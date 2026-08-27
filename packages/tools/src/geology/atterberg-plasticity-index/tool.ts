import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AtterbergPlasticityIndexInput = {
  readonly liquidLimitPercent: number;
  readonly plasticLimitPercent: number;
};

export type AtterbergPlasticityIndexOutput = {
  readonly plasticityIndexPercent: number;
};

export const calculateAtterbergPlasticityIndex = (
  input: AtterbergPlasticityIndexInput,
): AtterbergPlasticityIndexOutput => {
  for (const key of ["liquidLimitPercent", "plasticLimitPercent"] as const) {
    const value = input[key];
    if (!(typeof value === "number" && value >= 0 && Number.isFinite(value)))
      simpleError(
        key,
        "Atterberg limits must be finite and non-negative.",
        "invalid_limit",
      );
  }
  if (input.liquidLimitPercent < input.plasticLimitPercent)
    simpleError(
      "liquidLimitPercent",
      "Liquid limit must not be less than the plastic limit.",
      "invalid_limits",
    );
  return {
    plasticityIndexPercent:
      input.liquidLimitPercent - input.plasticLimitPercent,
  };
};

export const atterbergPlasticityIndexExample = {
  input: { liquidLimitPercent: 42, plasticLimitPercent: 21 },
  output: { plasticityIndexPercent: 21 },
} satisfies ToolExample<
  AtterbergPlasticityIndexInput,
  AtterbergPlasticityIndexOutput
>;

export const atterbergPlasticityIndexTool = createSimpleTool({
  id: "geology/atterberg-plasticity-index",
  title: "Atterberg Plasticity Index Calculator",
  description:
    "Compute the plasticity index PI as liquid limit minus plastic limit, both in water-content percent.",
  inputs: [
    {
      description: "Liquid limit in water-content percent.",
      id: "liquidLimitPercent",
      kind: "number",
      label: "LL",
    },
    {
      description: "Plastic limit in water-content percent.",
      id: "plasticLimitPercent",
      kind: "number",
      label: "PL",
    },
  ],
  outputs: [
    {
      description: "Plasticity index in water-content percent.",
      id: "plasticityIndexPercent",
      kind: "number",
      label: "PI",
    },
  ],
  calculate: (input) =>
    calculateAtterbergPlasticityIndex(
      input as unknown as AtterbergPlasticityIndexInput,
    ),
});

export const runAtterbergPlasticityIndex = atterbergPlasticityIndexTool.execute;
export default atterbergPlasticityIndexTool;
