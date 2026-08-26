import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NavLightLuminousRangeCorrectedInput = {
  readonly nominalRangeNm: number;
  readonly visibilityNm: number;
};

export type NavLightLuminousRangeCorrectedOutput = {
  readonly correctedRangeNm: number;
};

export const navLightLuminousRangeCorrectedExample = {
  input: { nominalRangeNm: 12, visibilityNm: 5 },
  output: { correctedRangeNm: 7.547733061615517 },
} satisfies ToolExample<
  NavLightLuminousRangeCorrectedInput,
  NavLightLuminousRangeCorrectedOutput
>;

export const calculateNavLightLuminousRangeCorrected = (
  input: NavLightLuminousRangeCorrectedInput,
): NavLightLuminousRangeCorrectedOutput => {
  if (!(Number.isFinite(input.nominalRangeNm) && input.nominalRangeNm > 0))
    simpleError(
      "nominalRangeNm",
      "Nominal range must be positive.",
      "invalid_input",
    );
  if (!(Number.isFinite(input.visibilityNm) && input.visibilityNm >= 0))
    simpleError(
      "visibilityNm",
      "Visibility must be finite and non-negative.",
      "invalid_visibility",
    );
  if (input.visibilityNm === 0) return { correctedRangeNm: 0 };

  const referenceTransmissivity = 0.05 ** (1 / 10);
  const actualTransmissivity = 0.05 ** (1 / input.visibilityNm);
  const threshold =
    referenceTransmissivity ** input.nominalRangeNm / input.nominalRangeNm ** 2;
  const illuminanceRatio = (distanceNm: number): number =>
    actualTransmissivity ** distanceNm / distanceNm ** 2;
  let lowerNm = 0;
  let upperNm = Math.max(input.nominalRangeNm, input.visibilityNm);
  while (illuminanceRatio(upperNm) > threshold) upperNm *= 2;
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const midpointNm = (lowerNm + upperNm) / 2;
    if (illuminanceRatio(midpointNm) > threshold) lowerNm = midpointNm;
    else upperNm = midpointNm;
  }
  return { correctedRangeNm: (lowerNm + upperNm) / 2 };
};

export const navLightLuminousRangeCorrectedTool = createSimpleTool({
  calculate: (input) =>
    calculateNavLightLuminousRangeCorrected(
      input as unknown as NavLightLuminousRangeCorrectedInput,
    ),
  description:
    "Correct a navigation light's nominal range for prevailing meteorological visibility using Allard's inverse-square and atmospheric-transmission relation. Nominal range is defined at ten nautical miles of visibility.",
  id: "sailing/nav-light-luminous-range-corrected",
  inputs: [
    {
      description: "Charted luminous range of the light in clear conditions.",
      format: "length-nm",
      id: "nominalRangeNm",
      kind: "number",
      label: "Nominal range",
      unit: "NM",
    },
    {
      description:
        "Prevailing meteorological visibility; ranges above ten nautical miles can increase the luminous range.",
      format: "length-nm",
      id: "visibilityNm",
      kind: "number",
      label: "Visibility",
      minimum: 0,
      unit: "NM",
    },
  ],
  outputs: [
    {
      description:
        "Expected range at which the light becomes visible in the given visibility.",
      format: "length-nm",
      id: "correctedRangeNm",
      kind: "number",
      label: "Corrected range",
      unit: "NM",
    },
  ],
  title: "Light Range Corrected",
});
export const runNavLightLuminousRangeCorrected =
  navLightLuminousRangeCorrectedTool.execute;
export default navLightLuminousRangeCorrectedTool;
