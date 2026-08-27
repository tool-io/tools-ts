import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type OneDbCompressionPointInput = {
  readonly ip3Dbm: number;
};

export type OneDbCompressionPointOutput = {
  readonly p1dbDbm: number;
};

export const oneDbCompressionPointExample = {
  input: { ip3Dbm: 30 },
  output: { p1dbDbm: 20.4 },
} satisfies ToolExample<
  OneDbCompressionPointInput,
  OneDbCompressionPointOutput
>;

export const oneDbCompressionPointTool = createSimpleTool({
  id: "electronics/1db-compression-point",
  title: "P1dB Estimate",
  description:
    "Estimate the 1 dB compression point from IP3 using the documented rule P1dB(dBm) = IP3(dBm) - 9.6.",
  inputs: [{ id: "ip3Dbm", label: "IP3", kind: "number", unit: "dBm" }],
  outputs: [{ id: "p1dbDbm", label: "P1dB", kind: "number", unit: "dBm" }],
  calculate: (input) => {
    const ip3Dbm = input.ip3Dbm as number;
    return {
      p1dbDbm: ip3Dbm - 9.6,
    };
  },
});
export const runOneDbCompressionPoint = oneDbCompressionPointTool.execute;
export default oneDbCompressionPointTool;
