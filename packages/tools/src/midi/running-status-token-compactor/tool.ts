import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ messagesJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "messagesJson", label: "messagesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.midiRecords(i.messagesJson);
  let status = 0;
  return H.finish({
    bytes: r.flatMap((v) => {
      const same = status === v.status;
      status = v.status;
      return [...(same ? [] : [v.status]), ...v.data];
    }),
  });
};
export const example = {
  input: {
    messagesJson:
      '[{"status":144,"data":[60,100]},{"status":144,"data":[62,0]}]',
  },
  output: { result: { bytes: [144, 60, 100, 62, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "midi/running-status-token-compactor",
  title: "MIDI Running Status Token Compactor",
  description:
    "Compact consecutive equal explicit MIDI channel statuses into running-status byte tokens; no system or realtime record support.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
