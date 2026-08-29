import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    receiverCount: 64,
    unitLoadPerReceiver: 0.125,
    supportedUnitLoads: 32,
  },
  output: { totalUnitLoads: 8, remainingUnitLoads: 24 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/rs485-bus-load",
  title: "RS-485 Receiver Unit Load",
  description:
    "Estimate total RS-485 receiver loading from receiver count and fractional unit load per receiver. Compare against the transceiver's supported unit-load budget; topology, termination, and bias loading remain separate.",
  inputs: [
    {
      id: "receiverCount",
      kind: "integer",
      label: "Receiver count",
      minimum: 0,
    },
    {
      id: "unitLoadPerReceiver",
      kind: "number",
      label: "Unit load per receiver",
      minimum: 0,
    },
    {
      id: "supportedUnitLoads",
      kind: "number",
      label: "Supported unit-load budget",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "totalUnitLoads", kind: "number", label: "Total Unit Loads" },
    { id: "remainingUnitLoads", kind: "number", label: "Remaining Unit Loads" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      totalUnitLoads: i.receiverCount * i.unitLoadPerReceiver,
      remainingUnitLoads:
        i.supportedUnitLoads - i.receiverCount * i.unitLoadPerReceiver,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type Rs485BusLoadInput = Readonly<typeof example.input>;
export type Rs485BusLoadOutput = Readonly<typeof example.output>;
export const rs485BusLoadTool = tool;
export const runRs485BusLoad = tool.execute;
export default tool;
