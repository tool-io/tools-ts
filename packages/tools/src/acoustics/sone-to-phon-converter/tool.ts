import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SoneToPhonConverterInput = Readonly<{
  readonly sones: number;
}>;
export type SoneToPhonConverterOutput = Readonly<{
  readonly phon: number;
}>;

export const calculateSoneToPhonConverter = (
  x: SoneToPhonConverterInput,
): SoneToPhonConverterOutput => {
  if (!Number.isFinite(x.sones) || x.sones <= 0)
    simpleError("sones", "Provide a finite positive number.");
  if (!(x.sones >= 1))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const phon = 40 + 10 * Math.log2(x.sones);
  if (!Number.isFinite(phon))
    simpleError("phon", "Inputs produce an undefined or out-of-range result.");
  return { phon: Object.is(phon, -0) ? 0 : phon };
};

export const example = {
  input: {
    sones: 2,
  },
  output: { phon: 50 },
} satisfies ToolExample<SoneToPhonConverterInput, SoneToPhonConverterOutput>;

export const tool = createSimpleTool({
  id: "acoustics/sone-to-phon-converter",
  title: "Sone To Phon Converter",
  description:
    "Phon level from loudness of at least one sone, using 40+10 log2(sones).",
  inputs: [{ id: "sones", kind: "number", label: "Sones", minimum: 0 }],
  outputs: [{ id: "phon", kind: "number", label: "Phon" }],
  calculate: (input) =>
    calculateSoneToPhonConverter({
      sones: input.sones as number,
    }),
});
export const soneToPhonConverterTool = tool;
export const runSoneToPhonConverter = tool.execute;
export default tool;
