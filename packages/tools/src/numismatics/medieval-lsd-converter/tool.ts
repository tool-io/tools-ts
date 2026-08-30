import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MedievalLsdConverterInput = Readonly<{
  readonly pounds: number;
  readonly shillings: number;
  readonly pence: number;
}>;
export type MedievalLsdConverterOutput = Readonly<{
  readonly totalPence: number;
}>;

export const calculateMedievalLsdConverter = (
  x: MedievalLsdConverterInput,
): MedievalLsdConverterOutput => {
  if (
    !Number.isFinite(x.pounds) ||
    x.pounds < 0 ||
    !Number.isSafeInteger(x.pounds)
  )
    simpleError("pounds", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.shillings) ||
    x.shillings < 0 ||
    !Number.isSafeInteger(x.shillings)
  )
    simpleError("shillings", "Provide a nonnegative whole number.");
  if (
    !Number.isFinite(x.pence) ||
    x.pence < 0 ||
    !Number.isSafeInteger(x.pence)
  )
    simpleError("pence", "Provide a nonnegative whole number.");
  const totalPence = x.pounds * 240 + x.shillings * 12 + x.pence;
  if (!Number.isFinite(totalPence))
    simpleError(
      "totalPence",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { totalPence: Object.is(totalPence, -0) ? 0 : totalPence };
};

export const example = {
  input: {
    pounds: 1,
    shillings: 2,
    pence: 6,
  },
  output: { totalPence: 270 },
} satisfies ToolExample<MedievalLsdConverterInput, MedievalLsdConverterOutput>;

export const tool = createSimpleTool({
  id: "numismatics/medieval-lsd-converter",
  title: "Medieval Lsd Converter",
  description:
    "Convert predecimal pounds, shillings, and pence to total pence at 20 shillings per pound and 12 pence per shilling.",
  inputs: [
    { id: "pounds", kind: "number", label: "Pounds", unit: "£" },
    { id: "shillings", kind: "number", label: "Shillings", unit: "s" },
    { id: "pence", kind: "number", label: "Pence", unit: "d" },
  ],
  outputs: [
    { id: "totalPence", kind: "number", label: "Total Pence", unit: "d" },
  ],
  calculate: (input) =>
    calculateMedievalLsdConverter({
      pounds: input.pounds as number,
      shillings: input.shillings as number,
      pence: input.pence as number,
    }),
});
export const runMedievalLsdConverter = tool.execute;
export default tool;
