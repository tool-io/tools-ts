import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StallSpeedGustInput = {
  readonly gustLoadFactorG: number;
  readonly stallingSpeedKt: number;
};

export type StallSpeedGustOutput = {
  readonly stallSpeedGustKt: number;
};

export const stallSpeedGustExample = {
  input: { gustLoadFactorG: 1.5625, stallingSpeedKt: 64 },
  output: { stallSpeedGustKt: 80 },
} satisfies ToolExample<StallSpeedGustInput, StallSpeedGustOutput>;

export const stallSpeedGustTool = createSimpleTool({
  id: "aviation/stall-speed-gust",
  title: "Gust Stall Speed Calculator",
  description:
    "Calculate stall speed at a specified gust load factor using Vₛ,n = Vₛ,1g × √n. Supply a load factor derived from the applicable aircraft gust-envelope method; gust velocity alone is not enough to determine it.",
  inputs: [
    {
      description:
        "Positive load factor produced by the gust, in multiples of standard gravity.",
      id: "gustLoadFactorG",
      label: "Gust load factor",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
    {
      id: "stallingSpeedKt",
      label: "Stalling speed",
      kind: "number",
      unit: "kt",
    },
  ],
  outputs: [
    {
      id: "stallSpeedGustKt",
      label: "Gust stall speed",
      kind: "number",
      unit: "kt",
    },
  ],
  calculate: (input) => {
    const stallingSpeedKt = input.stallingSpeedKt as number;
    if (stallingSpeedKt <= 0)
      simpleError(
        "stallingSpeedKt",
        "The stalling speed must be greater than zero.",
      );
    const gustLoadFactorG = input.gustLoadFactorG as number;
    if (gustLoadFactorG <= 0)
      simpleError(
        "gustLoadFactorG",
        "The gust load factor must be greater than zero.",
      );
    return { stallSpeedGustKt: stallingSpeedKt * Math.sqrt(gustLoadFactorG) };
  },
});
export const runStallSpeedGust = stallSpeedGustTool.execute;
export default stallSpeedGustTool;
