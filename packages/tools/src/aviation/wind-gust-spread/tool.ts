import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindGustSpreadInput = {
  readonly gustKt: number;
  readonly windKt: number;
};

export type WindGustSpreadOutput = {
  readonly gustSpreadKt: number;
};

export const windGustSpreadExample = {
  input: { gustKt: 25, windKt: 15 },
  output: { gustSpreadKt: 10 },
} satisfies ToolExample<WindGustSpreadInput, WindGustSpreadOutput>;

export const calculateWindGustSpread = (
  input: WindGustSpreadInput,
): WindGustSpreadOutput => {
  if (input.gustKt < input.windKt)
    simpleError(
      "gustKt",
      "The gust cannot be less than the sustained wind.",
      "invalid_gust",
    );
  return { gustSpreadKt: input.gustKt - input.windKt };
};

export const windGustSpreadTool = createSimpleTool({
  calculate: (input) =>
    calculateWindGustSpread(input as unknown as WindGustSpreadInput),
  description:
    "Compute the gust spread (peak gust minus sustained wind) for runway crosswind assessment.",
  id: "aviation/wind-gust-spread",
  inputs: [
    {
      description: "Peak reported gust.",
      id: "gustKt",
      kind: "number",
      label: "Gust",
      unit: "kt",
    },
    {
      description: "Sustained wind speed.",
      id: "windKt",
      kind: "number",
      label: "Sustained wind",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Difference between peak gust and sustained wind; larger spreads indicate unstable conditions.",
      format: "speed",
      id: "gustSpreadKt",
      kind: "number",
      label: "Gust spread",
      unit: "kt",
    },
  ],
  title: "Wind Gust Spread Calculator",
});
export const runWindGustSpread = windGustSpreadTool.execute;
export default windGustSpreadTool;
