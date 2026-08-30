import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly heavyIntensity: number;
  readonly lightIntensity: number;
  readonly heavyImpurityFraction: number;
}>;
export type Output = Readonly<{
  readonly correctedHeavyIntensity: number;
  readonly heavyToLightRatio: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.heavyIntensity < 0 ||
    input.lightIntensity <= 0 ||
    input.heavyImpurityFraction < 0 ||
    input.heavyImpurityFraction >= 1
  )
    simpleError(
      "lightIntensity",
      "Positive light intensity and valid isotope impurity fraction required.",
    );
  const correctedHeavyIntensity =
    input.heavyIntensity * (1 - input.heavyImpurityFraction);
  return {
    correctedHeavyIntensity,
    heavyToLightRatio: correctedHeavyIntensity / input.lightIntensity,
  };
};
export const exampleInput = {
  heavyIntensity: 120,
  lightIntensity: 40,
  heavyImpurityFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  correctedHeavyIntensity: 108,
  heavyToLightRatio: 2.7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/silac-heavy-light-ratio",
  title: "SILAC Heavy Light Ratio",
  description:
    "Calculate an impurity-adjusted SILAC heavy-to-light protein ratio.",
  inputs: [
    { id: "heavyIntensity", label: "Heavy intensity", kind: "number" },
    { id: "lightIntensity", label: "Light intensity", kind: "number" },
    {
      id: "heavyImpurityFraction",
      label: "Heavy impurity fraction",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "correctedHeavyIntensity",
      label: "Corrected heavy intensity",
      kind: "number",
    },
    { id: "heavyToLightRatio", label: "Heavy to light ratio", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      heavyIntensity: value.heavyIntensity as number,
      lightIntensity: value.lightIntensity as number,
      heavyImpurityFraction: value.heavyImpurityFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
