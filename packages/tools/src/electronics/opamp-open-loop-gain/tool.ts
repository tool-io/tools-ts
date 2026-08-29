import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { outputVoltageV: 10, differentialInputV: 0.0001 },
  output: { openLoopGain: 100000 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/opamp-open-loop-gain",
  title: "Op-Amp Open-Loop Gain",
  description:
    "Calculate open-loop voltage gain A=Vout/(V+−V−) from an unsaturated operating-point measurement. Differential input cannot be zero; this scalar does not capture frequency-dependent gain.",
  inputs: [
    { id: "outputVoltageV", kind: "number", label: "Output voltage (V)" },
    {
      id: "differentialInputV",
      kind: "number",
      label: "Differential input voltage (V)",
    },
  ],
  outputs: [{ id: "openLoopGain", kind: "number", label: "Open Loop Gain" }],
  calculate: (input) => {
    const i = input as Record<string, number>;
    if (i.differentialInputV === 0)
      simpleError("differentialInputV", "Differential input must be nonzero.");
    const output = { openLoopGain: i.outputVoltageV / i.differentialInputV };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type OpampOpenLoopGainInput = Readonly<typeof example.input>;
export type OpampOpenLoopGainOutput = Readonly<typeof example.output>;
export const opampOpenLoopGainTool = tool;
export const runOpampOpenLoopGain = tool.execute;
export default tool;
