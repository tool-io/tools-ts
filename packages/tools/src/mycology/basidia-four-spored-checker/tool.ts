import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BasidiaFourSporedCheckerInput = {
  readonly sporesPerBasidium: number;
};

export type BasidiaFourSporedCheckerOutput = {
  readonly isFourSpored: boolean;
  readonly observedSporeCount: number;
};

export const basidiaFourSporedCheckerExample = {
  input: { sporesPerBasidium: 4 },
  output: { isFourSpored: true, observedSporeCount: 4 },
} satisfies ToolExample<
  BasidiaFourSporedCheckerInput,
  BasidiaFourSporedCheckerOutput
>;

export const calculateBasidiaFourSporedChecker = (
  input: BasidiaFourSporedCheckerInput,
): BasidiaFourSporedCheckerOutput => {
  if (!(
    Number.isSafeInteger(input.sporesPerBasidium) &&
    input.sporesPerBasidium >= 1
  ))
    return simpleError(
      "sporesPerBasidium",
      "Observed spore count must be a positive whole number.",
      "invalid_spore_count",
    );
  return {
    isFourSpored: input.sporesPerBasidium === 4,
    observedSporeCount: input.sporesPerBasidium,
  };
};

export const basidiaFourSporedCheckerTool = createSimpleTool({
  id: "mycology/basidia-four-spored-checker",
  title: "Basidia Spored Checker",
  description:
    "Check whether the observed spore count per basidium is four. The tool does not infer sterigma count because aborted or immature spores can make that count differ from observed spores.",
  inputs: [
    {
      id: "sporesPerBasidium",
      kind: "integer",
      label: "Spores per basidium",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "isFourSpored", label: "Is four-spored", kind: "boolean" },
    {
      id: "observedSporeCount",
      label: "Observed spore count",
      kind: "integer",
    },
  ],
  calculate: (input) =>
    calculateBasidiaFourSporedChecker({
      sporesPerBasidium: input.sporesPerBasidium as number,
    }),
});
export const runBasidiaFourSporedChecker = basidiaFourSporedCheckerTool.execute;
export default basidiaFourSporedCheckerTool;
