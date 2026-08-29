import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { psrrDb: 80 },
  output: { rejectionRatio: 10000 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/opamp-psrr-linear",
  title: "Op-Amp PSRR dB to Linear",
  description:
    "Convert power-supply rejection ratio from voltage-ratio decibels to a linear rejection factor, 10^(PSRR/20). A 80 dB PSRR means a 10,000:1 small-signal voltage rejection at the stated frequency.",
  inputs: [{ id: "psrrDb", kind: "number", label: "PSRR (dB)" }],
  outputs: [{ id: "rejectionRatio", kind: "number", label: "Rejection Ratio" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = { rejectionRatio: Math.pow(10, i.psrrDb / 20) };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type OpampPsrrLinearInput = Readonly<typeof example.input>;
export type OpampPsrrLinearOutput = Readonly<typeof example.output>;
export const opampPsrrLinearTool = tool;
export const runOpampPsrrLinear = tool.execute;
export default tool;
