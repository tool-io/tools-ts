import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TowerTroyPoundNoteGeneratorInput = {
  readonly towerPounds: number;
};

export type TowerTroyPoundNoteGeneratorOutput = {
  readonly towerGrains: number;
  readonly troyPounds: number;
  readonly sterlingPennies: number;
  readonly grams: number;
};

const TOWER_GRAINS_PER_TOWER_POUND = 5400;
const TROY_GRAINS_PER_TROY_POUND = 5760;
const GRAMS_PER_TROY_GRAIN = 0.06479891;

export const calculateTowerTroyPoundNoteGenerator = (
  input: TowerTroyPoundNoteGeneratorInput,
): TowerTroyPoundNoteGeneratorOutput => {
  if (!(
    typeof input.towerPounds === "number" &&
    Number.isFinite(input.towerPounds) &&
    input.towerPounds >= 0
  ))
    return simpleError(
      "towerPounds",
      "Tower pounds must be a finite non-negative number.",
      "invalid_weight",
    );
  const towerGrains = input.towerPounds * TOWER_GRAINS_PER_TOWER_POUND;
  const output = {
    towerGrains,
    troyPounds: towerGrains / TROY_GRAINS_PER_TROY_POUND,
    sterlingPennies: input.towerPounds * 240,
    grams: towerGrains * GRAMS_PER_TROY_GRAIN,
  };
  if (!Object.values(output).every(Number.isFinite))
    return simpleError(
      "towerPounds",
      "The converted mass exceeds the numeric range.",
      "numeric_overflow",
    );
  return output;
};

export const towerTroyPoundNoteGeneratorExample = {
  input: { towerPounds: 1 },
  output: {
    towerGrains: 5400,
    troyPounds: 0.9375,
    sterlingPennies: 240,
    grams: 349.914114,
  },
} satisfies ToolExample<
  TowerTroyPoundNoteGeneratorInput,
  TowerTroyPoundNoteGeneratorOutput
>;

export const towerTroyPoundNoteGeneratorTool = createSimpleTool({
  id: "paleography/tower-troy-pound-note-generator",
  title: "Tower Troy Pound Note Generator",
  description:
    "Generate the weight notes for a mint account in the pre-1526 English Tower (moneyers') pound of 240 pennyweights = 5400 grains = 15/16 troy pound, where one sterling penny was coined from one Tower pennyweight.",
  inputs: [
    {
      description: "Mass in Tower pounds.",
      id: "towerPounds",
      kind: "number",
      label: "Tower pounds",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Mass in Tower grains.",
      id: "towerGrains",
      kind: "number",
      label: "Tower grains",
    },
    {
      description: "Equivalent mass in troy pounds.",
      id: "troyPounds",
      kind: "number",
      label: "Troy pounds",
    },
    {
      description: "Sterling pennies at one pennyweight of silver per penny.",
      id: "sterlingPennies",
      kind: "number",
      label: "Sterling pennies",
    },
    {
      description: "Equivalent mass in metric grams.",
      id: "grams",
      kind: "number",
      label: "Grams",
    },
  ],
  calculate: (input) =>
    calculateTowerTroyPoundNoteGenerator({
      towerPounds: input.towerPounds as number,
    }),
});

export const runTowerTroyPoundNoteGenerator =
  towerTroyPoundNoteGeneratorTool.execute;
export default towerTroyPoundNoteGeneratorTool;
