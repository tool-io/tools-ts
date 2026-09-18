import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  messagesJson: string;
  channels: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "messagesJson", label: "messagesJson", kind: "string" },
  { id: "channels", label: "channels", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.midiRecords(i.messagesJson);
  H.check(i.channels.length === 16);
  i.channels.forEach((x) => H.int(x, 0, 15));
  return H.finish({
    messages: r.map((v) => ({
      status: (v.status & 240) + i.channels[v.status & 15],
      data: v.data,
    })),
  });
};
export const example = {
  input: {
    messagesJson: '[{"status":144,"data":[60,100]}]',
    channels: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  output: { result: { messages: [{ status: 145, data: [60, 100] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/channel-message-channel-remapper",
  title: "MIDI Channel Message Channel Remapper",
  description:
    "Remap all MIDI channel-message channels through an explicit sixteen-entry old-to-new channel table; preserve message type and data.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
