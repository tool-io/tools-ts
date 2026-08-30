import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WireVoltageDropInput = Readonly<{
  readonly oneWayLengthM: number;
  readonly resistanceOhmPerM: number;
  readonly currentA: number;
}>;
export type WireVoltageDropOutput = Readonly<{
  readonly voltageDropV: number;
}>;

export const calculateWireVoltageDrop = (
  x: WireVoltageDropInput,
): WireVoltageDropOutput => {
  if (!Number.isFinite(x.oneWayLengthM) || x.oneWayLengthM < 0)
    simpleError("oneWayLengthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.resistanceOhmPerM) || x.resistanceOhmPerM < 0)
    simpleError("resistanceOhmPerM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.currentA) || x.currentA < 0)
    simpleError("currentA", "Provide a finite number at least 0.");
  const voltageDropV = 2 * x.oneWayLengthM * x.resistanceOhmPerM * x.currentA;
  if (!Number.isFinite(voltageDropV))
    simpleError("voltageDropV", "The inputs produce an invalid result.");
  return { voltageDropV: Object.is(voltageDropV, -0) ? 0 : voltageDropV };
};

export const example = {
  input: { oneWayLengthM: 10, resistanceOhmPerM: 0.01, currentA: 5 },
  output: { voltageDropV: 1 },
} satisfies ToolExample<WireVoltageDropInput, WireVoltageDropOutput>;

export const tool = createSimpleTool({
  id: "construction/wire-voltage-drop",
  title: "Wire Voltage Drop",
  description:
    "Estimate round-trip DC voltage drop of a two-conductor circuit from one-way length, conductor resistance per meter, and current.",
  inputs: [
    {
      id: "oneWayLengthM",
      kind: "number",
      label: "One-way wire length",
      unit: "m",
      minimum: 0,
    },
    {
      id: "resistanceOhmPerM",
      kind: "number",
      label: "Conductor resistance",
      unit: "Ω/m",
      minimum: 0,
    },
    {
      id: "currentA",
      kind: "number",
      label: "Load current",
      unit: "A",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "voltageDropV",
      kind: "number",
      label: "Round-trip voltage drop",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateWireVoltageDrop({
      oneWayLengthM: input.oneWayLengthM as number,
      resistanceOhmPerM: input.resistanceOhmPerM as number,
      currentA: input.currentA as number,
    }),
});
export const wireVoltageDropTool = tool;
export const runWireVoltageDrop = tool.execute;
export default tool;
