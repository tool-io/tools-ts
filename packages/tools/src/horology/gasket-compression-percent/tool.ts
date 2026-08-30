import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GasketCompressionPercentInput = Readonly<{
  readonly uncompressedMillimeters: number;
  readonly installedMillimeters: number;
}>;
export type GasketCompressionPercentOutput = Readonly<{
  readonly compressionPercent: number;
}>;

export const calculateGasketCompressionPercent = (
  x: GasketCompressionPercentInput,
): GasketCompressionPercentOutput => {
  if (
    !Number.isFinite(x.uncompressedMillimeters) ||
    x.uncompressedMillimeters <= 0
  )
    simpleError("uncompressedMillimeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.installedMillimeters) || x.installedMillimeters < 0)
    simpleError("installedMillimeters", "Provide a finite nonnegative number.");
  if (!(x.installedMillimeters <= x.uncompressedMillimeters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const compressionPercent =
    (100 * (x.uncompressedMillimeters - x.installedMillimeters)) /
    x.uncompressedMillimeters;
  if (!Number.isFinite(compressionPercent))
    simpleError(
      "compressionPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    compressionPercent: Object.is(compressionPercent, -0)
      ? 0
      : compressionPercent,
  };
};

export const example = {
  input: {
    uncompressedMillimeters: 2,
    installedMillimeters: 1.5,
  },
  output: { compressionPercent: 25 },
} satisfies ToolExample<
  GasketCompressionPercentInput,
  GasketCompressionPercentOutput
>;

export const tool = createSimpleTool({
  id: "horology/gasket-compression-percent",
  title: "Gasket Compression Percent",
  description:
    "Gasket compression percentage from uncompressed thickness and installed compressed thickness.",
  inputs: [
    {
      id: "uncompressedMillimeters",
      kind: "number",
      label: "Uncompressed Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "installedMillimeters",
      kind: "number",
      label: "Installed Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "compressionPercent",
      kind: "number",
      label: "Compression Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateGasketCompressionPercent({
      uncompressedMillimeters: input.uncompressedMillimeters as number,
      installedMillimeters: input.installedMillimeters as number,
    }),
});
export const gasketCompressionPercentTool = tool;
export const runGasketCompressionPercent = tool.execute;
export default tool;
