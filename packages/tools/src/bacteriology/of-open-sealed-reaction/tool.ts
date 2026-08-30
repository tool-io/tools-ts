import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly openTubeAcid: boolean;
  readonly sealedTubeAcid: boolean;
  readonly openGrowth: boolean;
  readonly sealedGrowth: boolean;
}>;
export type Output = Readonly<{
  readonly metabolismPattern: string;
}>;
export const calculate = (input: Input): Output => {
  if (
    (input.openTubeAcid && !input.openGrowth) ||
    (input.sealedTubeAcid && !input.sealedGrowth)
  )
    simpleError(
      "openGrowth",
      "Acid reactions require observed growth in the corresponding tube.",
    );
  const metabolismPattern =
    input.openTubeAcid && input.sealedTubeAcid
      ? "fermentative"
      : input.openTubeAcid
        ? "oxidative"
        : input.sealedTubeAcid
          ? "discordant-sealed-only"
          : input.openGrowth || input.sealedGrowth
            ? "no-acid-observed"
            : "uninterpretable-no-growth";
  return { metabolismPattern };
};
export const exampleInput = {
  openTubeAcid: true,
  sealedTubeAcid: false,
  openGrowth: true,
  sealedGrowth: true,
} satisfies Input;
export const exampleOutput = {
  metabolismPattern: "oxidative",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/of-open-sealed-reaction",
  title: "Of Open Sealed Reaction",
  description:
    "Decode paired open/sealed oxidative-fermentative observations while separating no-growth and discordant cases.",
  inputs: [
    { id: "openTubeAcid", label: "Open tube acid", kind: "boolean" },
    { id: "sealedTubeAcid", label: "Sealed tube acid", kind: "boolean" },
    { id: "openGrowth", label: "Open growth", kind: "boolean" },
    { id: "sealedGrowth", label: "Sealed growth", kind: "boolean" },
  ],
  outputs: [
    { id: "metabolismPattern", label: "Metabolism pattern", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      openTubeAcid: value.openTubeAcid as boolean,
      sealedTubeAcid: value.sealedTubeAcid as boolean,
      openGrowth: value.openGrowth as boolean,
      sealedGrowth: value.sealedGrowth as boolean,
    }),
});
export const run = tool.execute;
export default tool;
