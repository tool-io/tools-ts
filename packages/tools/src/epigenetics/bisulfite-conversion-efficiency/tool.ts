import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly convertedNonCpgCs: number;
  readonly totalNonCpgCs: number;
  readonly minimumConversionPercent: number;
}>;
export type Output = Readonly<{
  readonly conversionPercent: number;
  readonly unconvertedCount: number;
  readonly passes: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.totalNonCpgCs <= 0 ||
    input.convertedNonCpgCs < 0 ||
    input.convertedNonCpgCs > input.totalNonCpgCs
  )
    simpleError(
      "convertedNonCpgCs",
      "Converted counts must not exceed positive total.",
    );
  const conversionPercent =
    (input.convertedNonCpgCs / input.totalNonCpgCs) * 100;
  return {
    conversionPercent,
    unconvertedCount: input.totalNonCpgCs - input.convertedNonCpgCs,
    passes: conversionPercent >= input.minimumConversionPercent,
  };
};

export const exampleInput = {
  convertedNonCpgCs: 90,
  totalNonCpgCs: 100,
  minimumConversionPercent: 95,
} satisfies Input;
export const exampleOutput = {
  conversionPercent: 90,
  unconvertedCount: 10,
  passes: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/bisulfite-conversion-efficiency",
  title: "Bisulfite Conversion Efficiency",
  description: "Check bisulfite conversion efficiency from non-CpG cytosines.",
  inputs: [
    { id: "convertedNonCpgCs", kind: "number", label: "Converted non cpg cs" },
    { id: "totalNonCpgCs", kind: "number", label: "Total non cpg cs" },
    {
      id: "minimumConversionPercent",
      kind: "number",
      label: "Minimum conversion percent",
    },
  ],
  outputs: [
    { id: "conversionPercent", kind: "number", label: "Conversion percent" },
    { id: "unconvertedCount", kind: "number", label: "Unconverted count" },
    { id: "passes", kind: "boolean", label: "Passes" },
  ],
  calculate: (value) =>
    calculate({
      convertedNonCpgCs: value.convertedNonCpgCs as number,
      totalNonCpgCs: value.totalNonCpgCs as number,
      minimumConversionPercent: value.minimumConversionPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
