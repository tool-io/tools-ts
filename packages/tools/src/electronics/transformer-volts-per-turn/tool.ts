import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TransformerVoltsPerTurnInput = {
  readonly primaryTurnsInt: number;
  readonly primaryVolts: number;
};

export type TransformerVoltsPerTurnOutput = {
  readonly voltsPerTurn: number;
};

export const transformerVoltsPerTurnExample = {
  input: { primaryTurnsInt: 100, primaryVolts: 230 },
  output: { voltsPerTurn: 2.3 },
} satisfies ToolExample<
  TransformerVoltsPerTurnInput,
  TransformerVoltsPerTurnOutput
>;

export const calculateTransformerVoltsPerTurn = (
  input: TransformerVoltsPerTurnInput,
): TransformerVoltsPerTurnOutput => {
  if (!(input.primaryVolts > 0))
    simpleError(
      "primaryVolts",
      "Primary voltage must be positive.",
      "invalid_voltage",
    );
  if (!Number.isSafeInteger(input.primaryTurnsInt) || input.primaryTurnsInt < 1)
    simpleError(
      "primaryTurnsInt",
      "Primary turns must be an integer of at least one.",
      "invalid_turns",
    );
  return { voltsPerTurn: input.primaryVolts / input.primaryTurnsInt };
};

export const transformerVoltsPerTurnTool = createSimpleTool({
  calculate: (input) =>
    calculateTransformerVoltsPerTurn(
      input as unknown as TransformerVoltsPerTurnInput,
    ),
  description:
    "Compute the volts per turn of a transformer primary winding from the applied primary voltage and its turn count.",
  id: "electronics/transformer-volts-per-turn",
  inputs: [
    {
      description: "Voltage applied to the primary winding.",
      id: "primaryVolts",
      kind: "number",
      label: "Primary voltage",
      unit: "V",
    },
    {
      description: "Number of turns on the primary winding.",
      id: "primaryTurnsInt",
      kind: "integer",
      label: "Primary turns",
    },
  ],
  outputs: [
    {
      description: "Voltage induced per turn of the winding.",
      id: "voltsPerTurn",
      kind: "number",
      label: "Volts per turn",
      unit: "V/turn",
    },
  ],
  title: "Volts Per Turn",
});
export const runTransformerVoltsPerTurn = transformerVoltsPerTurnTool.execute;
export default transformerVoltsPerTurnTool;
