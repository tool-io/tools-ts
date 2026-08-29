import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ComparatorInputOffsetVoltageInput = Readonly<{
  readonly switchingVoltageV: number;
  readonly referenceVoltageV: number;
}>;
export type ComparatorInputOffsetVoltageOutput = Readonly<{
  inputOffsetVoltageV: number;
}>;

export const calculateComparatorInputOffsetVoltage = (
  i: ComparatorInputOffsetVoltageInput,
): ComparatorInputOffsetVoltageOutput => {
  const value = i.switchingVoltageV - i.referenceVoltageV;
  if (!Number.isFinite(value))
    simpleError(
      "inputOffsetVoltageV",
      "The inputs produce a non-finite result.",
    );
  return { inputOffsetVoltageV: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { switchingVoltageV: 2.503, referenceVoltageV: 2.5 },
  output: { inputOffsetVoltageV: 0.0030000000000001137 },
} satisfies ToolExample<
  ComparatorInputOffsetVoltageInput,
  ComparatorInputOffsetVoltageOutput
>;

export const tool = createSimpleTool({
  id: "electronics/comparator-input-offset-voltage",
  title: "Comparator Input Offset Voltage",
  description:
    "Measure signed comparator input offset as the observed switching input voltage minus the nominal reference voltage.",
  inputs: [
    {
      id: "switchingVoltageV",
      kind: "number",
      label: "Switching (V)",
      unit: "V",
    },
    {
      id: "referenceVoltageV",
      kind: "number",
      label: "Reference (V)",
      unit: "V",
    },
  ],
  outputs: [
    {
      id: "inputOffsetVoltageV",
      kind: "number",
      label: "Input Offset (V)",
      unit: "V",
    },
  ],
  calculate: (input) =>
    calculateComparatorInputOffsetVoltage({
      switchingVoltageV: input.switchingVoltageV as number,
      referenceVoltageV: input.referenceVoltageV as number,
    }),
});
export const comparatorInputOffsetVoltageTool = tool;
export const runComparatorInputOffsetVoltage = tool.execute;
export default tool;
