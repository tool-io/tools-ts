import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const isoseismalAnnulusAreaBetweenIntensitiesExample = {
  input: {
    epicentralIntensityI0: 8,
    outerIntensity: 5,
    innerIntensity: 6,
    focalDepthKm: 10,
  },
  output: (() => {
    const rO = 10 * Math.sqrt(Math.pow(10, 1) ** 2 - 1);
    const rI = 10 * Math.sqrt(Math.pow(10, 2 / 3) ** 2 - 1);
    return {
      annulusAreaKm2: Math.PI * (rO ** 2 - rI ** 2),
      outerRadiusKm: rO,
      innerRadiusKm: rI,
    };
  })(),
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const isoseismalAnnulusAreaBetweenIntensitiesTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({
      epicentralIntensityI0,
      outerIntensity,
      innerIntensity,
      focalDepthKm,
    }) => {
      if (
        innerIntensity <= outerIntensity ||
        innerIntensity > epicentralIntensityI0
      )
        simpleError("innerIntensity", "Require I₀ ≥ I_in > I_out.");
      const radius = (I: number) => {
        const ratio = Math.pow(10, (epicentralIntensityI0 - I) / 3);
        return focalDepthKm * Math.sqrt(ratio * ratio - 1);
      };
      const rOut = radius(outerIntensity);
      const rIn = radius(innerIntensity);
      return {
        annulusAreaKm2: Math.PI * (rOut ** 2 - rIn ** 2),
        outerRadiusKm: rOut,
        innerRadiusKm: rIn,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Felt area of the annulus between two intensity contours using the Kövesligethy decay.",
  id: "seismology/isoseismal-annulus-area-between-intensities",
  inputs: [
    {
      description: "Epicentral intensity.",
      id: "epicentralIntensityI0",
      kind: "number",
      label: "I₀",
    },
    {
      description: "Outer contour intensity.",
      id: "outerIntensity",
      kind: "number",
      label: "I_out",
    },
    {
      description: "Inner contour intensity.",
      id: "innerIntensity",
      kind: "number",
      label: "I_in",
    },
    {
      minimum: 0,
      description: "Focal depth.",
      id: "focalDepthKm",
      kind: "number",
      label: "h",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Area between the two isoseismals.",
      id: "annulusAreaKm2",
      kind: "number",
      label: "A",
      unit: "km²",
    },
    {
      description: "Outer contour radius.",
      id: "outerRadiusKm",
      kind: "number",
      label: "r_out",
      unit: "km",
    },
    {
      description: "Inner contour radius.",
      id: "innerRadiusKm",
      kind: "number",
      label: "r_in",
      unit: "km",
    },
  ],
  title: "Isoseismal Annulus Area Between Intensities Calculator",
});
export const runIsoseismalAnnulusAreaBetweenIntensities =
  isoseismalAnnulusAreaBetweenIntensitiesTool.execute;
export { isoseismalAnnulusAreaBetweenIntensitiesExample as example };
export default isoseismalAnnulusAreaBetweenIntensitiesTool;
