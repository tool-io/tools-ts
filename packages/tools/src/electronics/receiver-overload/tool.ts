import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReceiverOverloadInput = Readonly<{
  readonly maximumInputDbm: number;
  readonly actualInputDbm: number;
}>;
export type ReceiverOverloadOutput = Readonly<{
  readonly headroomDb: number;
}>;

export const calculateReceiverOverload = (
  x: ReceiverOverloadInput,
): ReceiverOverloadOutput => {
  if (!Number.isFinite(x.maximumInputDbm))
    simpleError("maximumInputDbm", "Provide a finite number.");
  if (!Number.isFinite(x.actualInputDbm))
    simpleError("actualInputDbm", "Provide a finite number.");
  const headroomDb = x.maximumInputDbm - x.actualInputDbm;
  if (!Number.isFinite(headroomDb))
    simpleError("headroomDb", "The inputs produce an invalid result.");
  return { headroomDb: Object.is(headroomDb, -0) ? 0 : headroomDb };
};

export const example = {
  input: { maximumInputDbm: 0, actualInputDbm: -3 },
  output: { headroomDb: 3 },
} satisfies ToolExample<ReceiverOverloadInput, ReceiverOverloadOutput>;

export const tool = createSimpleTool({
  id: "electronics/receiver-overload",
  title: "Receiver Overload",
  description:
    "Calculate receiver input headroom from maximum specified input power and actual input power in dBm; a negative result indicates overload.",
  inputs: [
    {
      id: "maximumInputDbm",
      kind: "number",
      label: "Maximum receiver input",
      unit: "dBm",
    },
    {
      id: "actualInputDbm",
      kind: "number",
      label: "Actual receiver input",
      unit: "dBm",
    },
  ],
  outputs: [
    { id: "headroomDb", kind: "number", label: "Input headroom", unit: "dB" },
  ],
  calculate: (input) =>
    calculateReceiverOverload({
      maximumInputDbm: input.maximumInputDbm as number,
      actualInputDbm: input.actualInputDbm as number,
    }),
});
export const receiverOverloadTool = tool;
export const runReceiverOverload = tool.execute;
export default tool;
