import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerEfficiencySimpleInput = Readonly<{
  readonly outputWatts: number;
  readonly inputWatts: number;
}>;
export type TransformerEfficiencySimpleOutput = Readonly<{
  readonly efficiencyPercent: number;
}>;

export const calculateTransformerEfficiencySimple = (
  x: TransformerEfficiencySimpleInput,
): TransformerEfficiencySimpleOutput => {
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
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    efficiencyPercent: Object.is(efficiencyPercent, -0) ? 0 : efficiencyPercent,
  };
};

export const example = {
  input: { outputWatts: 900, inputWatts: 1000 },
  output: { efficiencyPercent: 90 },
} satisfies ToolExample<
  TransformerEfficiencySimpleInput,
  TransformerEfficiencySimpleOutput
>;

export const tool = createSimpleTool({
  id: "engineering/transformer-efficiency-simple",
  title: "Transformer Efficiency Simple",
  description:
    "Transformer efficiency as output real power divided by input real power.",
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
    calculateTransformerEfficiencySimple({
      outputWatts: input.outputWatts as number,
      inputWatts: input.inputWatts as number,
    }),
});
export const transformerEfficiencySimpleTool = tool;
export const runTransformerEfficiencySimple = tool.execute;
export default tool;
