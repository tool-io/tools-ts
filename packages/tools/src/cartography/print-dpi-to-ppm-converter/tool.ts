import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PrintDpiToPpmConverterInput = Readonly<{
  readonly dotsPerInch: number;
}>;
export type PrintDpiToPpmConverterOutput = Readonly<{
  readonly pixelsPerMeter: number;
}>;

export const calculatePrintDpiToPpmConverter = (
  x: PrintDpiToPpmConverterInput,
): PrintDpiToPpmConverterOutput => {
  if (!Number.isFinite(x.dotsPerInch) || x.dotsPerInch < 0)
    simpleError("dotsPerInch", "Provide a finite nonnegative number.");
  const pixelsPerMeter = x.dotsPerInch / 0.0254;
  if (!Number.isFinite(pixelsPerMeter))
    simpleError(
      "pixelsPerMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { pixelsPerMeter: Object.is(pixelsPerMeter, -0) ? 0 : pixelsPerMeter };
};

export const example = {
  input: {
    dotsPerInch: 300,
  },
  output: { pixelsPerMeter: 11811.023622047245 },
} satisfies ToolExample<
  PrintDpiToPpmConverterInput,
  PrintDpiToPpmConverterOutput
>;

export const tool = createSimpleTool({
  id: "cartography/print-dpi-to-ppm-converter",
  title: "Print Dpi To Ppm Converter",
  description:
    "Printer pixels per metre from dots per inch using exactly 0.0254 metre per inch.",
  inputs: [
    {
      id: "dotsPerInch",
      kind: "number",
      label: "Dots Per Inch",
      unit: "dpi",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pixelsPerMeter",
      kind: "number",
      label: "Pixels Per Meter",
      unit: "px/m",
    },
  ],
  calculate: (input) =>
    calculatePrintDpiToPpmConverter({
      dotsPerInch: input.dotsPerInch as number,
    }),
});
export const printDpiToPpmConverterTool = tool;
export const runPrintDpiToPpmConverter = tool.execute;
export default tool;
