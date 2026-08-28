import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const transistorCollectorResistorExample = {
  input: { collectorCurrentMa: 10, supplyVolts: 12 },
} satisfies ToolExample<{
  readonly collectorCurrentMa: number;
  readonly supplyVolts: number;
}>;

export const transistorCollectorResistorTool = createSimpleTool({
  id: "electronics/transistor-collector-resistor",
  title: "Collector Resistor Value",
  description:
    "Compute the collector resistor value in ohms for a bipolar junction transistor from the supply voltage, saturation voltage, and collector current.",
  inputs: [
    { id: "supplyVolts", label: "Supply voltage", kind: "number" },
    {
      default: 0.2,
      id: "saturationVolts",
      label: "Saturation voltage",
      kind: "number",
    },
    { id: "collectorCurrentMa", label: "Collector current", kind: "number" },
  ],
  outputs: [
    {
      id: "collectorResistorOhms",
      label: "Collector resistor",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const supplyVolts = input.supplyVolts as number;
    const saturationVolts = input.saturationVolts as number;
    const collectorCurrentMa = input.collectorCurrentMa as number;
    if (supplyVolts <= saturationVolts)
      simpleError(
        "supplyVolts",
        "Supply voltage must exceed the saturation voltage.",
        "invalid_supply",
      );
    if (collectorCurrentMa <= 0)
      simpleError(
        "collectorCurrentMa",
        "Collector current must be greater than zero.",
      );
    return {
      collectorResistorOhms:
        ((supplyVolts - saturationVolts) / collectorCurrentMa) * 1000,
    };
  },
});
export const runTransistorCollectorResistor =
  transistorCollectorResistorTool.execute;
export default transistorCollectorResistorTool;
