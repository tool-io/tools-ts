import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThirdOrderInterceptPointInput = {
  readonly plOneDbm: number;
  readonly im3Dbm: number;
};

export type ThirdOrderInterceptPointOutput = {
  readonly ip3Dbm: number;
};

export const thirdOrderInterceptPointExample = {
  input: { plOneDbm: 10, im3Dbm: -30 },
  output: { ip3Dbm: 30 },
} satisfies ToolExample<
  ThirdOrderInterceptPointInput,
  ThirdOrderInterceptPointOutput
>;

export const thirdOrderInterceptPointTool = createSimpleTool({
  id: "electronics/third-order-intercept-point",
  title: "IP3 From Two Tones",
  description:
    "Compute the output third-order intercept point as IP3(dBm) = P(dBm) + (P(dBm) - IM3(dBm)) / 2 from a single tone level and its IM3 product.",
  inputs: [
    { id: "plOneDbm", label: "Tone power", kind: "number", unit: "dBm" },
    { id: "im3Dbm", label: "IM3 product", kind: "number", unit: "dBm" },
  ],
  outputs: [{ id: "ip3Dbm", label: "IP3", kind: "number", unit: "dBm" }],
  calculate: (input) => {
    const plOneDbm = input.plOneDbm as number;
    const im3Dbm = input.im3Dbm as number;
    if (!Number.isFinite(plOneDbm))
      simpleError("plOneDbm", "Tone power must be finite.", "invalid_level");
    if (!Number.isFinite(im3Dbm))
      simpleError("im3Dbm", "IM3 product must be finite.", "invalid_level");
    return {
      ip3Dbm: plOneDbm + (plOneDbm - im3Dbm) / 2,
    };
  },
});
export const runThirdOrderInterceptPoint = thirdOrderInterceptPointTool.execute;
export default thirdOrderInterceptPointTool;
