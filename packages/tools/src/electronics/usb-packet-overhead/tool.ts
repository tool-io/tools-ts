import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UsbPacketOverheadInput = Readonly<{
  readonly packetBytes: number;
  readonly payloadBytes: number;
}>;
export type UsbPacketOverheadOutput = Readonly<{
  readonly overheadPercent: number;
}>;

export const calculateUsbPacketOverhead = (
  x: UsbPacketOverheadInput,
): UsbPacketOverheadOutput => {
  if (!Number.isSafeInteger(x.packetBytes) || x.packetBytes < 0)
    simpleError("packetBytes", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.payloadBytes) || x.payloadBytes < 0)
    simpleError("payloadBytes", "Provide a safe integer at least 0.");
  if (!(x.packetBytes > 0 && x.payloadBytes <= x.packetBytes))
    simpleError("input", "Packet must be positive and at least payload size.");
  const overheadPercent =
    (100 * (x.packetBytes - x.payloadBytes)) / x.packetBytes;
  if (!Number.isFinite(overheadPercent))
    simpleError("overheadPercent", "The inputs produce an invalid result.");
  return {
    overheadPercent: Object.is(overheadPercent, -0) ? 0 : overheadPercent,
  };
};

export const example = {
  input: { packetBytes: 100, payloadBytes: 64 },
  output: { overheadPercent: 36 },
} satisfies ToolExample<UsbPacketOverheadInput, UsbPacketOverheadOutput>;

export const tool = createSimpleTool({
  id: "electronics/usb-packet-overhead",
  title: "USB Packet Overhead",
  description:
    "Calculate the fraction of an already measured USB packet occupied by non-payload bytes, including protocol fields supplied in total length.",
  inputs: [
    {
      id: "packetBytes",
      kind: "integer",
      label: "On-wire packet bytes",
      unit: "B",
      minimum: 0,
    },
    {
      id: "payloadBytes",
      kind: "integer",
      label: "Application payload bytes",
      unit: "B",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "overheadPercent",
      kind: "number",
      label: "Non-payload overhead",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateUsbPacketOverhead({
      packetBytes: input.packetBytes as number,
      payloadBytes: input.payloadBytes as number,
    }),
});
export const usbPacketOverheadTool = tool;
export const runUsbPacketOverhead = tool.execute;
export default tool;
