import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QUnitMillimeterJapaneseInput = Readonly<{
  readonly qUnits: number;
}>;
export type QUnitMillimeterJapaneseOutput = Readonly<{
  readonly millimeters: number;
}>;

export const calculateQUnitMillimeterJapanese = (
  x: QUnitMillimeterJapaneseInput,
): QUnitMillimeterJapaneseOutput => {
  if (!Number.isFinite(x.qUnits) || x.qUnits < 0)
    simpleError("qUnits", "Provide a finite nonnegative number.");
  const millimeters = x.qUnits / 4;
  if (!Number.isFinite(millimeters))
    simpleError(
      "millimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { millimeters: Object.is(millimeters, -0) ? 0 : millimeters };
};

export const example = {
  input: {
    qUnits: 4,
  },
  output: { millimeters: 1 },
} satisfies ToolExample<
  QUnitMillimeterJapaneseInput,
  QUnitMillimeterJapaneseOutput
>;

export const tool = createSimpleTool({
  id: "typography/q-unit-millimeter-japanese",
  title: "Q Unit Millimeter Japanese",
  description:
    "Millimetres from CSS Q units; one Q is exactly one quarter millimetre.",
  inputs: [
    { id: "qUnits", kind: "number", label: "Q Units", unit: "Q", minimum: 0 },
  ],
  outputs: [
    { id: "millimeters", kind: "number", label: "Millimeters", unit: "mm" },
  ],
  calculate: (input) =>
    calculateQUnitMillimeterJapanese({
      qUnits: input.qUnits as number,
    }),
});
export const qUnitMillimeterJapaneseTool = tool;
export const runQUnitMillimeterJapanese = tool.execute;
export default tool;
