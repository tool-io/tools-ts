// Repertoire source: https://www.osha.gov/hazcom/pictograms
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomHazardPictogramInput = Readonly<Record<string, never>>;
export type RandomHazardPictogramOutput = { readonly value: string };

const source = {
  values: [
    "GHS01 — Exploding bomb",
    "GHS02 — Flame",
    "GHS03 — Flame over circle",
    "GHS04 — Gas cylinder",
    "GHS05 — Corrosion",
    "GHS06 — Skull and crossbones",
    "GHS07 — Exclamation mark",
    "GHS08 — Health hazard",
    "GHS09 — Environment",
  ],
} as const;

export const randomHazardPictogramValueCount = 9;

export const calculateRandomHazardPictogram = (
  random: RandomSource = Math.random,
): RandomHazardPictogramOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomHazardPictogramExample = {
  input: {},
} satisfies ToolExample<
  RandomHazardPictogramInput,
  RandomHazardPictogramOutput
>;

export const randomHazardPictogramTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomHazardPictogram(
      context.random ?? Math.random,
    );
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one of the nine GHS hazard pictogram codes using injected randomness; the portable result identifies the official pictogram and does not replace a compliant label.",
  id: "random/hazard-pictogram",
  inputs: [],
  outputs: [
    {
      format: "random/hazard-pictogram",
      id: "value",
      kind: "string",
      label: "Random Hazard Pictogram",
    },
  ],
  title: "Random Hazard Pictogram Generator",
});

export const runRandomHazardPictogram = randomHazardPictogramTool.execute;
export default randomHazardPictogramTool;
