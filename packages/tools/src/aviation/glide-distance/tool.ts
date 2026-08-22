import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

/** Nautical mile in feet. */
const FT_PER_NM = 6076.115485564;

export type GlideDistanceInput = {
  readonly altitudeFt: number;
  readonly glideRatio: number;
};

export type GlideDistanceOutput = {
  readonly distanceNm: number;
};

export const glideDistanceExample = {
  input: { altitudeFt: 5000, glideRatio: 9 },
  output: { distanceNm: 7.4060475162 },
} satisfies ToolExample<GlideDistanceInput, GlideDistanceOutput>;

export const calculateGlideDistance = (
  input: GlideDistanceInput,
): GlideDistanceOutput => {
  if (input.altitudeFt <= 0 || input.glideRatio <= 0)
    simpleError(
      "altitudeFt",
      "Altitude and glide ratio must be positive.",
      "invalid_input",
    );
  const distanceFt = input.altitudeFt * input.glideRatio;
  return { distanceNm: roundStatistic(distanceFt / FT_PER_NM) };
};

export const glideDistanceTool = createSimpleTool({
  calculate: (input) =>
    calculateGlideDistance(input as unknown as GlideDistanceInput),
  description:
    "Compute how far an aircraft can glide from an altitude at a given glide ratio.",
  id: "aviation/glide-distance",
  inputs: [
    {
      description: "Altitude available for the glide.",
      id: "altitudeFt",
      kind: "number",
      label: "Altitude",
      unit: "ft",
    },
    {
      description:
        "Glide ratio, for example nine for nine forward units per one down.",
      id: "glideRatio",
      kind: "number",
      label: "Glide ratio",
    },
  ],
  outputs: [
    {
      description: "Horizontal gliding distance.",
      format: "length-nm",
      id: "distanceNm",
      kind: "number",
      label: "Glide distance",
      unit: "nm",
    },
  ],
  title: "Glide Distance Calculator",
});
export const runGlideDistance = glideDistanceTool.execute;
export default glideDistanceTool;
