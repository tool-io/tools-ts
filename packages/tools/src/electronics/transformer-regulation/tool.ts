import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { noLoadVoltageV: 120, fullLoadVoltageV: 115 },
  output: { regulationPercent: 4.3478260869565215 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/transformer-regulation",
  title: "Transformer Voltage Regulation",
  description:
    "Calculate transformer voltage regulation as (no-load secondary voltage − full-load secondary voltage)/full-load voltage ×100. Use measurements at the same primary voltage and frequency.",
  inputs: [
    {
      id: "noLoadVoltageV",
      kind: "number",
      label: "No-load secondary voltage (V)",
      minimum: 0,
    },
    {
      id: "fullLoadVoltageV",
      kind: "number",
      label: "Full-load secondary voltage (V)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "regulationPercent", kind: "number", label: "Regulation Percent" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      regulationPercent:
        ((i.noLoadVoltageV - i.fullLoadVoltageV) / i.fullLoadVoltageV) * 100,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type TransformerRegulationInput = Readonly<typeof example.input>;
export type TransformerRegulationOutput = Readonly<typeof example.output>;
export const transformerRegulationTool = tool;
export const runTransformerRegulation = tool.execute;
export default tool;
