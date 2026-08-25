import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TarePayloadNetGrossSplitInput = {
  readonly grossMassKg: number;
  readonly tareMassKg: number;
};

export type TarePayloadNetGrossSplitOutput = {
  readonly payloadNetMassKg: number;
  readonly tareSharePercent: number;
};

export const calculateTarePayloadNetGrossSplit = (
  input: TarePayloadNetGrossSplitInput,
): TarePayloadNetGrossSplitOutput => {
  if (!Number.isFinite(input.grossMassKg) || input.grossMassKg <= 0)
    return simpleError(
      "grossMassKg",
      "Gross mass must be finite and greater than zero.",
      "invalid_mass",
    );
  if (!Number.isFinite(input.tareMassKg) || input.tareMassKg < 0)
    return simpleError(
      "tareMassKg",
      "Tare mass must be finite and non-negative.",
      "invalid_mass",
    );
  if (input.tareMassKg >= input.grossMassKg)
    return simpleError(
      "tareMassKg",
      "Tare mass must be smaller than gross mass.",
      "invalid_mass",
    );
  return {
    payloadNetMassKg: input.grossMassKg - input.tareMassKg,
    tareSharePercent: (input.tareMassKg / input.grossMassKg) * 100,
  };
};

export const tarePayloadNetGrossSplitExample = {
  input: { grossMassKg: 24000, tareMassKg: 3800 },
  output: { payloadNetMassKg: 20200, tareSharePercent: 15.833333333333332 },
} satisfies ToolExample<
  TarePayloadNetGrossSplitInput,
  TarePayloadNetGrossSplitOutput
>;

export const tarePayloadNetGrossSplitTool = createSimpleTool({
  id: "logistics/tare-payload-net-gross-split",
  title: "Tare Payload Net Gross Split",
  description:
    "Split a weighed gross mass into net payload and tare share using the equipment's tare weight.",
  inputs: [
    {
      description: "Gross (loaded) mass in kilograms.",
      id: "grossMassKg",
      kind: "number",
      label: "Gross",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
    {
      description:
        "Tare (empty) mass of the container or vehicle in kilograms.",
      id: "tareMassKg",
      kind: "number",
      label: "Tare",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Net payload mass in kilograms.",
      id: "payloadNetMassKg",
      kind: "number",
      label: "Net payload",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
    {
      description: "Tare mass as a percentage of the gross mass.",
      id: "tareSharePercent",
      kind: "number",
      label: "Tare share %",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateTarePayloadNetGrossSplit({
      grossMassKg: input.grossMassKg as number,
      tareMassKg: input.tareMassKg as number,
    }),
});

export const runTarePayloadNetGrossSplit = tarePayloadNetGrossSplitTool.execute;
export default tarePayloadNetGrossSplitTool;
