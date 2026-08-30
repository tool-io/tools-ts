import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhonToSoneConverterInput = Readonly<{
  readonly phon: number;
}>;
export type PhonToSoneConverterOutput = Readonly<{
  readonly sones: number;
}>;

export const calculatePhonToSoneConverter = (
  x: PhonToSoneConverterInput,
): PhonToSoneConverterOutput => {
  if (!Number.isFinite(x.phon) || x.phon < 0)
    simpleError("phon", "Provide a finite nonnegative number.");
  if (!(x.phon >= 40))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const sones = 2 ** ((x.phon - 40) / 10);
  if (!Number.isFinite(sones))
    simpleError("sones", "Inputs produce an undefined or out-of-range result.");
  return { sones: Object.is(sones, -0) ? 0 : sones };
};

export const example = {
  input: {
    phon: 50,
  },
  output: { sones: 2 },
} satisfies ToolExample<PhonToSoneConverterInput, PhonToSoneConverterOutput>;

export const tool = createSimpleTool({
  id: "acoustics/phon-to-sone-converter",
  title: "Phon To Sone Converter",
  description:
    "Loudness in sones from phon level for 40 phon or above: 1 sone at 40 phon, doubling every 10 phon.",
  inputs: [{ id: "phon", kind: "number", label: "Phon", minimum: 0 }],
  outputs: [{ id: "sones", kind: "number", label: "Sones" }],
  calculate: (input) =>
    calculatePhonToSoneConverter({
      phon: input.phon as number,
    }),
});
export const phonToSoneConverterTool = tool;
export const runPhonToSoneConverter = tool.execute;
export default tool;
