import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EthernetFrameOverheadInput = Readonly<{
  readonly payloadBytes: number;
  readonly headerBytes: number;
  readonly fcsBytes: number;
  readonly preambleBytes: number;
  readonly interframeGapBytes: number;
}>;
export type EthernetFrameOverheadOutput = Readonly<{
  readonly overheadPercent: number;
}>;

export const calculateEthernetFrameOverhead = (
  x: EthernetFrameOverheadInput,
): EthernetFrameOverheadOutput => {
  if (!Number.isSafeInteger(x.payloadBytes) || x.payloadBytes < 0)
    simpleError("payloadBytes", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.headerBytes) || x.headerBytes < 0)
    simpleError("headerBytes", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.fcsBytes) || x.fcsBytes < 0)
    simpleError("fcsBytes", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.preambleBytes) || x.preambleBytes < 0)
    simpleError("preambleBytes", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.interframeGapBytes) || x.interframeGapBytes < 0)
    simpleError("interframeGapBytes", "Provide a safe integer at least 0.");
  if (
    !(
      x.payloadBytes +
        x.headerBytes +
        x.fcsBytes +
        x.preambleBytes +
        x.interframeGapBytes >
      0
    )
  )
    simpleError("input", "Total on-wire length must be positive.");
  const overheadPercent =
    (100 *
      (x.headerBytes + x.fcsBytes + x.preambleBytes + x.interframeGapBytes)) /
    (x.payloadBytes +
      x.headerBytes +
      x.fcsBytes +
      x.preambleBytes +
      x.interframeGapBytes);
  if (!Number.isFinite(overheadPercent))
    simpleError("overheadPercent", "The inputs produce an invalid result.");
  return {
    overheadPercent: Object.is(overheadPercent, -0) ? 0 : overheadPercent,
  };
};

export const example = {
  input: {
    payloadBytes: 1500,
    headerBytes: 14,
    fcsBytes: 4,
    preambleBytes: 8,
    interframeGapBytes: 12,
  },
  output: { overheadPercent: 2.4707412223667102 },
} satisfies ToolExample<
  EthernetFrameOverheadInput,
  EthernetFrameOverheadOutput
>;

export const tool = createSimpleTool({
  id: "electronics/ethernet-frame-overhead",
  title: "Ethernet Frame Overhead",
  description:
    "Calculate Ethernet overhead percentage from payload, frame-header, FCS, preamble, and interframe-gap byte-equivalent counts.",
  inputs: [
    {
      id: "payloadBytes",
      kind: "integer",
      label: "Payload length",
      unit: "B",
      minimum: 0,
    },
    {
      id: "headerBytes",
      kind: "integer",
      label: "MAC header bytes",
      unit: "B",
      minimum: 0,
    },
    {
      id: "fcsBytes",
      kind: "integer",
      label: "FCS bytes",
      unit: "B",
      minimum: 0,
    },
    {
      id: "preambleBytes",
      kind: "integer",
      label: "Preamble and SFD bytes",
      unit: "B",
      minimum: 0,
    },
    {
      id: "interframeGapBytes",
      kind: "integer",
      label: "Interframe gap byte times",
      unit: "B",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "overheadPercent",
      kind: "number",
      label: "On-wire overhead",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateEthernetFrameOverhead({
      payloadBytes: input.payloadBytes as number,
      headerBytes: input.headerBytes as number,
      fcsBytes: input.fcsBytes as number,
      preambleBytes: input.preambleBytes as number,
      interframeGapBytes: input.interframeGapBytes as number,
    }),
});
export const ethernetFrameOverheadTool = tool;
export const runEthernetFrameOverhead = tool.execute;
export default tool;
