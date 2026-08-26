import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SectorSearchLegLengthInput = {
  readonly radiusNm: number;
  readonly sectorAngleDeg?: number;
};

export type SectorSearchLegLengthOutput = {
  readonly chordLengthNm: number;
};

const DEFAULT_SECTOR_ANGLE_DEG = 30;
const MIN_SECTOR_ANGLE_DEG = 30;
const MAX_SECTOR_ANGLE_DEG = 120;

export const calculateSectorSearchLegLength = (
  input: SectorSearchLegLengthInput,
): SectorSearchLegLengthOutput | null => {
  const sectorAngleDeg = input.sectorAngleDeg ?? DEFAULT_SECTOR_ANGLE_DEG;
  return Number.isFinite(input.radiusNm) &&
    Number.isFinite(sectorAngleDeg) &&
    input.radiusNm > 0 &&
    sectorAngleDeg >= MIN_SECTOR_ANGLE_DEG &&
    sectorAngleDeg <= MAX_SECTOR_ANGLE_DEG
    ? {
        chordLengthNm:
          2 * input.radiusNm * Math.sin((sectorAngleDeg / 2) * (Math.PI / 180)),
      }
    : null;
};

export const sectorSearchLegLengthExample = {
  input: { radiusNm: 2, sectorAngleDeg: 30 },
  output: { chordLengthNm: 1.035276180410083 },
} satisfies ToolExample<
  SectorSearchLegLengthInput,
  SectorSearchLegLengthOutput
>;

export const sectorSearchLegLengthTool = createSimpleTool({
  id: "sailing/sector-search-leg-length",
  title: "Sector Search Leg Length",
  description:
    "Calculate the chord between successive radials of a sector search pattern as twice the radius times the sine of half the sector angle.",
  inputs: [
    {
      description: "Radius of the circular search area.",
      id: "radiusNm",
      kind: "number",
      label: "Radius",
      unit: "NM",
    },
    {
      default: DEFAULT_SECTOR_ANGLE_DEG,
      description: "Angle between successive search legs.",
      id: "sectorAngleDeg",
      kind: "number",
      label: "Sector angle",
      maximum: MAX_SECTOR_ANGLE_DEG,
      minimum: MIN_SECTOR_ANGLE_DEG,
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description: "Straight line distance crossed on each leg.",
      format: "length-nm",
      id: "chordLengthNm",
      kind: "number",
      label: "Chord length",
      unit: "NM",
    },
  ],
  calculate: (input) => {
    const chordLengthNm = calculateSectorSearchLegLength(
      input as unknown as SectorSearchLegLengthInput,
    );
    if (chordLengthNm === null)
      simpleError(
        "radiusNm",
        "The radius must be finite and greater than zero.",
        "invalid_radius",
      );
    return chordLengthNm;
  },
});

export const runSectorSearchLegLength = sectorSearchLegLengthTool.execute;
export default sectorSearchLegLengthTool;
