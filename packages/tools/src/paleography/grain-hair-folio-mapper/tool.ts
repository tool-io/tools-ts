import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GrainHairFolioMapperInput = {
  readonly leavesPerQuire?: number;
  readonly firstRectoSide?: "hair" | "flesh";
  readonly arrangement?: "uniform_rectos" | "alternating_openings";
};

export type GrainHairFolioMapperOutput = {
  readonly hairRectoLeafNumbers: number[];
  readonly fleshRectoLeafNumbers: number[];
};

export const calculateGrainHairFolioMapper = (
  input: GrainHairFolioMapperInput,
): GrainHairFolioMapperOutput => {
  const leavesPerQuire = input.leavesPerQuire ?? 8;
  const firstRectoSide = input.firstRectoSide ?? "hair";
  const arrangement = input.arrangement ?? "uniform_rectos";
  if (
    !(Number.isSafeInteger(leavesPerQuire) && leavesPerQuire >= 2) ||
    leavesPerQuire % 2 !== 0 ||
    leavesPerQuire > toolResourceLimits.generatedValues
  )
    return simpleError(
      "leavesPerQuire",
      `Leaves per quire must be an even integer from 2 through ${toolResourceLimits.generatedValues.toLocaleString("en-US")}.`,
      "invalid_quire",
    );
  const hairRectoLeafNumbers: number[] = [];
  const fleshRectoLeafNumbers: number[] = [];
  for (let leaf = 1; leaf <= leavesPerQuire; leaf += 1) {
    let rectoSide: "hair" | "flesh";
    if (arrangement === "uniform_rectos") {
      rectoSide = firstRectoSide;
    } else {
      rectoSide =
        leaf % 2 === 1
          ? firstRectoSide
          : firstRectoSide === "hair"
            ? "flesh"
            : "hair";
    }
    if (rectoSide === "hair") hairRectoLeafNumbers.push(leaf);
    else fleshRectoLeafNumbers.push(leaf);
  }
  return { hairRectoLeafNumbers, fleshRectoLeafNumbers };
};

export const grainHairFolioMapperExample = {
  input: {
    arrangement: "alternating_openings",
    firstRectoSide: "hair",
    leavesPerQuire: 8,
  },
  output: {
    hairRectoLeafNumbers: [1, 3, 5, 7],
    fleshRectoLeafNumbers: [2, 4, 6, 8],
  },
} satisfies ToolExample<GrainHairFolioMapperInput, GrainHairFolioMapperOutput>;

export const grainHairFolioMapperTool = createSimpleTool({
  id: "paleography/grain-hair-folio-mapper",
  title: "Grain Hair/Folio Mapper",
  description:
    "Map which folios of a quire show hair or flesh on their rectos under your declared nesting model (uniform rectos of one chosen skin, or alternating so each opening pairs identical skins), as exact leaf lists.",
  inputs: [
    {
      default: 8,
      description: "Even leaf count of the quire.",
      id: "leavesPerQuire",
      kind: "integer",
      label: "Leaves per quire",
      maximum: toolResourceLimits.generatedValues,
      minimum: 2,
    },
    {
      default: "hair",
      description: "Skin facing the quire's opening recto.",
      enum: ["hair", "flesh"],
      id: "firstRectoSide",
      kind: "string",
      label: "First recto side",
    },
    {
      default: "uniform_rectos",
      description: "Declared nesting model for skin sides.",
      enum: ["uniform_rectos", "alternating_openings"],
      id: "arrangement",
      kind: "string",
      label: "Arrangement",
    },
  ],
  outputs: [
    {
      description: "Leaves whose recto shows the hair side.",
      id: "hairRectoLeafNumbers",
      kind: "numberList",
      label: "Hair rectos",
    },
    {
      description: "Leaves whose recto shows the flesh side.",
      id: "fleshRectoLeafNumbers",
      kind: "numberList",
      label: "Flesh rectos",
    },
  ],
  calculate: (input) =>
    calculateGrainHairFolioMapper({
      arrangement:
        input.arrangement as GrainHairFolioMapperInput["arrangement"],
      firstRectoSide:
        input.firstRectoSide as GrainHairFolioMapperInput["firstRectoSide"],
      leavesPerQuire: input.leavesPerQuire as number,
    }),
});

export const runGrainHairFolioMapper = grainHairFolioMapperTool.execute;
export default grainHairFolioMapperTool;
