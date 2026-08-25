import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AscusEightSporedCheckerInput = {
  readonly sporesPerAscus: number;
};

export type AscusEightSporedCheckerOutput = {
  readonly isEightSpored: boolean;
  readonly sporesPerAscus: number;
};

export const ascusEightSporedCheckerExample = {
  input: { sporesPerAscus: 8 },
  output: { isEightSpored: true, sporesPerAscus: 8 },
} satisfies ToolExample<
  AscusEightSporedCheckerInput,
  AscusEightSporedCheckerOutput
>;

export const calculateAscusEightSporedChecker = (
  input: AscusEightSporedCheckerInput,
): AscusEightSporedCheckerOutput => {
  if (!(
    Number.isSafeInteger(input.sporesPerAscus) && input.sporesPerAscus >= 1
  ))
    return simpleError(
      "sporesPerAscus",
      "Spore count must be a positive whole number.",
      "invalid_spore_count",
    );
  return {
    isEightSpored: input.sporesPerAscus === 8,
    sporesPerAscus: input.sporesPerAscus,
  };
};

export const ascusEightSporedCheckerTool = createSimpleTool({
  id: "mycology/ascus-eight-spored-checker",
  title: "Ascus Spore Count",
  description:
    "Report whether the observed count is exactly eight spores per ascus without imposing an arbitrary upper limit on other observations.",
  inputs: [
    {
      id: "sporesPerAscus",
      kind: "integer",
      label: "Spores per ascus",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "isEightSpored", kind: "boolean", label: "Is eight spored" },
    {
      id: "sporesPerAscus",
      kind: "integer",
      label: "Spores per ascus",
      minimum: 1,
    },
  ],
  calculate: (input) =>
    calculateAscusEightSporedChecker({
      sporesPerAscus: input.sporesPerAscus as number,
    }),
});
export const runAscusEightSporedChecker = ascusEightSporedCheckerTool.execute;
export default ascusEightSporedCheckerTool;
