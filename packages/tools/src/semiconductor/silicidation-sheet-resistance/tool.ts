import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SilicidationSheetResistanceInput = {
  readonly filmResistivityMicroOhmCm: number;
  readonly filmThicknessNm: number;
};

export type SilicidationSheetResistanceOutput = {
  readonly sheetResistanceOhmsPerSq: number;
};

export const silicidationSheetResistanceExample = {
  input: { filmResistivityMicroOhmCm: 10, filmThicknessNm: 10 },
  output: { sheetResistanceOhmsPerSq: 10 },
} satisfies ToolExample<
  SilicidationSheetResistanceInput,
  SilicidationSheetResistanceOutput
>;

export const calculateSilicidationSheetResistance = (
  input: SilicidationSheetResistanceInput,
): SilicidationSheetResistanceOutput => {
  if (input.filmResistivityMicroOhmCm <= 0)
    simpleError(
      "filmResistivityMicroOhmCm",
      "Film resistivity must be positive.",
      "invalid_film_resistivity",
    );
  if (input.filmThicknessNm <= 0)
    simpleError(
      "filmThicknessNm",
      "Film thickness must be positive.",
      "invalid_film_thickness",
    );
  const directSheetResistance =
    (input.filmResistivityMicroOhmCm * 10) / input.filmThicknessNm;
  return {
    sheetResistanceOhmsPerSq: Number.isFinite(directSheetResistance)
      ? directSheetResistance
      : (input.filmResistivityMicroOhmCm / input.filmThicknessNm) * 10,
  };
};

export const silicidationSheetResistanceTool = createSimpleTool({
  calculate: (input) =>
    calculateSilicidationSheetResistance({
      filmResistivityMicroOhmCm: input.filmResistivityMicroOhmCm as number,
      filmThicknessNm: input.filmThicknessNm as number,
    }),
  description:
    "Convert silicide film resistivity and thickness into the sheet resistance of the silicided layer.",
  id: "semiconductor/silicidation-sheet-resistance",
  inputs: [
    {
      description: "Resistivity of the silicide film.",
      format: "resistivity",
      id: "filmResistivityMicroOhmCm",
      kind: "number",
      label: "Film resistivity",
      unit: "uohm*cm",
    },
    {
      description: "Silicide film thickness.",
      format: "length",
      id: "filmThicknessNm",
      kind: "number",
      label: "Film thickness",
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Sheet resistance of the silicide film.",
      format: "sheet-resistance",
      id: "sheetResistanceOhmsPerSq",
      kind: "number",
      label: "Sheet resistance",
      unit: "ohm/sq",
    },
  ],
  title: "Silicide Sheet Resistance Calculator",
});
export const runSilicidationSheetResistance =
  silicidationSheetResistanceTool.execute;
export default silicidationSheetResistanceTool;
