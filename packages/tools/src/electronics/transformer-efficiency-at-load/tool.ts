import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerEfficiencyAtLoadInput = Readonly<{
  readonly outputWatts: number;
  readonly inputWatts: number;
}>;
export type TransformerEfficiencyAtLoadOutput = Readonly<{
  readonly efficiencyPercent: number;
}>;

export const calculateTransformerEfficiencyAtLoad = (
  x: TransformerEfficiencyAtLoadInput,
): TransformerEfficiencyAtLoadOutput => {
  if (!Number.isFinite(x.outputWatts) || x.outputWatts < 0)
    simpleError("outputWatts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.inputWatts) || x.inputWatts < 0)
    simpleError("inputWatts", "Provide a finite number at least 0.");
  if (x.outputWatts > x.inputWatts)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const efficiencyPercent = (100 * x.outputWatts) / x.inputWatts;
  if (!Number.isFinite(efficiencyPercent))
    simpleError(
      "efficiencyPercent",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    efficiencyPercent: Object.is(efficiencyPercent, -0) ? 0 : efficiencyPercent,
  };
};

export const example = {
  input: { outputWatts: 90, inputWatts: 100 },
  output: { efficiencyPercent: 90 },
} satisfies ToolExample<
  TransformerEfficiencyAtLoadInput,
  TransformerEfficiencyAtLoadOutput
>;

export const tool = createSimpleTool({
  id: "electronics/transformer-efficiency-at-load",
  title: "Transformer Efficiency At Load",
  description:
    "Real output-power fraction of real input power at the specified transformer operating point.",
  inputs: [
    {
      id: "outputWatts",
      kind: "number",
      label: "Output Watts",
      unit: "W",
      minimum: 0,
    },
    {
      id: "inputWatts",
      kind: "number",
      label: "Input Watts",
      unit: "W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      kind: "number",
      label: "Efficiency Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateTransformerEfficiencyAtLoad({
      outputWatts: input.outputWatts as number,
      inputWatts: input.inputWatts as number,
    }),
});
export const transformerEfficiencyAtLoadTool = tool;
export const runTransformerEfficiencyAtLoad = tool.execute;
export default tool;
