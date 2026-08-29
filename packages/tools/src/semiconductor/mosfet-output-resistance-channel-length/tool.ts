import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const mosfetOutputResistanceChannelLengthExample = {
  input: { drainCurrentMa: 1, lambdaPerV: 0.02 },
  output: { outputResistanceKohm: 49.99999999999999 },
} satisfies ToolExample<
  MosfetOutputResistanceInput,
  MosfetOutputResistanceOutput
>;

export type MosfetOutputResistanceInput = {
  readonly lambdaPerV: number;
  readonly drainCurrentMa: number;
};
export type MosfetOutputResistanceOutput = {
  readonly outputResistanceKohm: number;
};

export const calculateMosfetOutputResistance = (
  input: MosfetOutputResistanceInput,
): MosfetOutputResistanceOutput => {
  if (input.lambdaPerV <= 0 || input.drainCurrentMa <= 0)
    simpleError(
      "lambdaPerV",
      "Lambda and current must be positive.",
      "invalid_input",
    );
  const idA = input.drainCurrentMa * 1e-3;
  return { outputResistanceKohm: 1 / (input.lambdaPerV * idA) / 1000 };
};

export const mosfetOutputResistanceChannelLengthTool = createSimpleTool({
  calculate: (input) =>
    calculateMosfetOutputResistance({
      drainCurrentMa: input.drainCurrentMa as number,
      lambdaPerV: input.lambdaPerV as number,
    }),
  description:
    "Compute the MOSFET small-signal output resistance from channel-length modulation.",
  id: "semiconductor/mosfet-output-resistance-channel-length",
  inputs: [
    {
      format: "lambda-per-v",
      id: "lambdaPerV",
      kind: "number",
      label: "Lambda",
      unit: "V^-1",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Quiescent drain current.",
      id: "drainCurrentMa",
      kind: "number",
      label: "ID",
      unit: "mA",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      format: "resistance-kohm",
      id: "outputResistanceKohm",
      kind: "number",
      label: "ro",
      unit: "kΩ",
    },
  ],
  title: "MOSFET Output Resistance Calculator",
});
export const runMosfetOutputResistance =
  mosfetOutputResistanceChannelLengthTool.execute;
export default mosfetOutputResistanceChannelLengthTool;
