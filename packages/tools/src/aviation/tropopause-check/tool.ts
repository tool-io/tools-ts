import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TropopauseCheckInput = {
  readonly altitudeFt: number;
};

export type TropopauseCheckOutput = {
  readonly atOrAboveTropopause: boolean;
};

const TROPOPAUSE_FT = 36_089;

export const tropopauseCheckExample = {
  input: { altitudeFt: 37000 },
  output: { atOrAboveTropopause: true },
} satisfies ToolExample<TropopauseCheckInput, TropopauseCheckOutput>;

export const calculateTropopauseCheck = (
  input: TropopauseCheckInput,
): TropopauseCheckOutput => ({
  atOrAboveTropopause: input.altitudeFt >= TROPOPAUSE_FT,
});

export const tropopauseCheckTool = createSimpleTool({
  calculate: (input) =>
    calculateTropopauseCheck(input as unknown as TropopauseCheckInput),
  description:
    "Check whether a given altitude is at or above the ISA tropopause.",
  id: "aviation/tropopause-check",
  inputs: [
    {
      description: "Pressure altitude to check.",
      id: "altitudeFt",
      kind: "number",
      label: "Altitude",
      unit: "ft",
    },
  ],
  outputs: [
    {
      description:
        "Whether the altitude is at or above the standard tropopause (36,089 ft).",
      id: "atOrAboveTropopause",
      kind: "boolean",
      label: "At or above tropopause",
    },
  ],
  title: "Tropopause Check Calculator",
});
export const runTropopauseCheck = tropopauseCheckTool.execute;
export default tropopauseCheckTool;
