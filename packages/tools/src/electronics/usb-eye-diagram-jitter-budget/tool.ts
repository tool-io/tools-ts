import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    unitIntervalPs: 500,
    requiredEyeWidthPs: 300,
    otherTimingPenaltyPs: 50,
  },
  output: { jitterBudgetPs: 150 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/usb-eye-diagram-jitter-budget",
  title: "USB Eye Jitter Budget",
  description:
    "Subtract a required open-eye width and other timing penalties from one unit interval to obtain remaining total jitter budget. All inputs are in picoseconds; apply the limits from the relevant USB generation and test specification.",
  inputs: [
    {
      id: "unitIntervalPs",
      kind: "number",
      label: "Unit interval (ps)",
      minimum: 0,
    },
    {
      id: "requiredEyeWidthPs",
      kind: "number",
      label: "Required eye width (ps)",
      minimum: 0,
    },
    {
      id: "otherTimingPenaltyPs",
      kind: "number",
      label: "Other timing penalty (ps)",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "jitterBudgetPs", kind: "number", label: "Jitter Budget ps" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      jitterBudgetPs:
        i.unitIntervalPs - i.requiredEyeWidthPs - i.otherTimingPenaltyPs,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type UsbEyeDiagramJitterBudgetInput = Readonly<typeof example.input>;
export type UsbEyeDiagramJitterBudgetOutput = Readonly<typeof example.output>;
export const usbEyeDiagramJitterBudgetTool = tool;
export const runUsbEyeDiagramJitterBudget = tool.execute;
export default tool;
