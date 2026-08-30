import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly julianCenturiesFromJ2000: number;
}>;
export type Output = Readonly<{
  readonly meanObliquityArcseconds: number;
  readonly meanObliquityDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  if (Math.abs(input.julianCenturiesFromJ2000) > 100)
    simpleError(
      "julianCenturiesFromJ2000",
      "Laskar polynomial is limited here to ±100 centuries from J2000.",
    );
  const u = input.julianCenturiesFromJ2000 / 100,
    coeff = [
      84381.448, -4680.93, -1.55, 1999.25, -51.38, -249.67, -39.05, 7.12, 27.87,
      5.79, 2.45,
    ];
  let meanObliquityArcseconds = 0;
  for (let i = coeff.length - 1; i >= 0; i--)
    meanObliquityArcseconds = meanObliquityArcseconds * u + coeff[i];
  return {
    meanObliquityArcseconds,
    meanObliquityDegrees: meanObliquityArcseconds / 3600,
  };
};
export const exampleInput = { julianCenturiesFromJ2000: 0 } satisfies Input;
export const exampleOutput = {
  meanObliquityArcseconds: 84381.448,
  meanObliquityDegrees: 23.439291111111114,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/laskar-mean-obliquity",
  title: "Laskar Mean Obliquity",
  description:
    "Evaluate the Laskar long-term mean-obliquity polynomial within ±10000 years of J2000; nutation and reference-frame realization are separate.",
  inputs: [
    {
      id: "julianCenturiesFromJ2000",
      label: "Julian centuries from j 2000",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "meanObliquityArcseconds",
      label: "Mean obliquity arcseconds",
      kind: "number",
    },
    {
      id: "meanObliquityDegrees",
      label: "Mean obliquity degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      julianCenturiesFromJ2000: value.julianCenturiesFromJ2000 as number,
    }),
});
export const run = tool.execute;
export default tool;
