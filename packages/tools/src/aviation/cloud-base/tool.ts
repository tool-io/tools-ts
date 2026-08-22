import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type CloudBaseInput = {
  readonly dewPointC: number;
  readonly temperatureC: number;
};

export type CloudBaseOutput = {
  readonly cloudBaseFt: number;
};

/** Approximate feet of cloud-base height per degree C of spread. */
const FT_PER_DEG_C_SPREAD = 400;

export const cloudBaseExample = {
  input: { dewPointC: 10, temperatureC: 20 },
  output: { cloudBaseFt: 4000 },
} satisfies ToolExample<CloudBaseInput, CloudBaseOutput>;

export const calculateCloudBase = (input: CloudBaseInput): CloudBaseOutput => {
  const spread = input.temperatureC - input.dewPointC;
  if (spread < 0)
    simpleError(
      "temperatureC",
      "The temperature cannot be below the dew point.",
      "invalid_spread",
    );
  return {
    cloudBaseFt: roundStatistic(spread * FT_PER_DEG_C_SPREAD),
  };
};

export const cloudBaseTool = createSimpleTool({
  calculate: (input) => calculateCloudBase(input as unknown as CloudBaseInput),
  description:
    "Estimate the cumulus cloud base height from the temperature-dew point spread.",
  id: "aviation/cloud-base",
  inputs: [
    {
      description: "Surface air temperature.",
      id: "temperatureC",
      kind: "number",
      label: "Temperature",
      unit: "°C",
    },
    {
      description: "Surface dew point.",
      id: "dewPointC",
      kind: "number",
      label: "Dew point",
      unit: "°C",
    },
  ],
  outputs: [
    {
      description: "Estimated cloud base above the surface.",
      format: "length-ft",
      id: "cloudBaseFt",
      kind: "number",
      label: "Cloud base",
      unit: "ft",
    },
  ],
  title: "Cloud Base Calculator",
});
export const runCloudBase = cloudBaseTool.execute;
export default cloudBaseTool;
