import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type FaradayInducedVoltageInput = {
  readonly turnsInt: number;
  readonly dFluxDtWbPerSecond: number;
};

export type FaradayInducedVoltageOutput = {
  readonly inducedEmfVolts: number;
};

export const faradayInducedVoltageExample = {
  input: { turnsInt: 100, dFluxDtWbPerSecond: -0.02 },
  output: { inducedEmfVolts: 2 },
} satisfies ToolExample<
  FaradayInducedVoltageInput,
  FaradayInducedVoltageOutput
>;

export const faradayInducedVoltageTool = createSimpleTool({
  id: "electronics/faraday-induced-voltage",
  title: "Faraday Induced EMF",
  description:
    "Compute the induced EMF as negative turns times the rate of change of magnetic flux.",
  inputs: [
    { id: "turnsInt", label: "Turns", kind: "integer", minimum: 1 },
    {
      id: "dFluxDtWbPerSecond",
      label: "Flux change rate",
      kind: "number",
      unit: "Wb/s",
    },
  ],
  outputs: [
    {
      id: "inducedEmfVolts",
      label: "Induced EMF",
      kind: "number",
      unit: "V",
    },
  ],
  calculate: (input) => ({
    inducedEmfVolts:
      -(input.turnsInt as number) * (input.dFluxDtWbPerSecond as number),
  }),
});
export const runFaradayInducedVoltage = faradayInducedVoltageTool.execute;
export default faradayInducedVoltageTool;
