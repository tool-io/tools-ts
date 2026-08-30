import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerVoltageRegulationInput = Readonly<{
  readonly noLoadVolts: number;
  readonly fullLoadVolts: number;
}>;
export type TransformerVoltageRegulationOutput = Readonly<{
  readonly regulationPercent: number;
}>;

export const calculateTransformerVoltageRegulation = (
  x: TransformerVoltageRegulationInput,
): TransformerVoltageRegulationOutput => {
  if (!Number.isFinite(x.noLoadVolts) || x.noLoadVolts < 0)
    simpleError("noLoadVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.fullLoadVolts) || x.fullLoadVolts < 0)
    simpleError("fullLoadVolts", "Provide a finite number at least 0.");
  const regulationPercent =
    (100 * (x.noLoadVolts - x.fullLoadVolts)) / x.fullLoadVolts;
  if (!Number.isFinite(regulationPercent))
    simpleError(
      "regulationPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    regulationPercent: Object.is(regulationPercent, -0) ? 0 : regulationPercent,
  };
};

export const example = {
  input: { noLoadVolts: 240, fullLoadVolts: 230 },
  output: { regulationPercent: 4.3478260869565215 },
} satisfies ToolExample<
  TransformerVoltageRegulationInput,
  TransformerVoltageRegulationOutput
>;

export const tool = createSimpleTool({
  id: "engineering/transformer-voltage-regulation",
  title: "Transformer Voltage Regulation",
  description:
    "Transformer voltage regulation at a specified load as (no-load secondary voltage−full-load voltage)/full-load voltage.",
  inputs: [
    {
      id: "noLoadVolts",
      kind: "number",
      label: "No Load Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "fullLoadVolts",
      kind: "number",
      label: "Full Load Volts",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "regulationPercent",
      kind: "number",
      label: "Regulation Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateTransformerVoltageRegulation({
      noLoadVolts: input.noLoadVolts as number,
      fullLoadVolts: input.fullLoadVolts as number,
    }),
});
export const transformerVoltageRegulationTool = tool;
export const runTransformerVoltageRegulation = tool.execute;
export default tool;
