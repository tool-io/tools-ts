import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly eyewearOpticalDensity: number;
  readonly requiredOpticalDensity: number;
  readonly visibleLightTransmissionPercent: number;
}>;
export type Output = Readonly<{
  readonly opticalDensityMargin: number;
  readonly hazardTransmissionFraction: number;
  readonly protectionVisibilityScore: number;
  readonly meetsRequiredDensity: boolean;
}>;

export const calculate = (input: Input): Output => {
  const opticalDensityMargin =
    input.eyewearOpticalDensity - input.requiredOpticalDensity;
  return {
    opticalDensityMargin,
    hazardTransmissionFraction: 10 ** -input.eyewearOpticalDensity,
    protectionVisibilityScore:
      input.visibleLightTransmissionPercent /
      (1 + Math.max(0, -opticalDensityMargin)),
    meetsRequiredDensity: opticalDensityMargin >= 0,
  };
};

export const exampleInput = {
  eyewearOpticalDensity: 5,
  requiredOpticalDensity: 4,
  visibleLightTransmissionPercent: 50,
} satisfies Input;
export const exampleOutput = {
  opticalDensityMargin: 1,
  hazardTransmissionFraction: 1e-5,
  protectionVisibilityScore: 50,
  meetsRequiredDensity: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      eyewearOpticalDensity: input.eyewearOpticalDensity as number,
      requiredOpticalDensity: input.requiredOpticalDensity as number,
      visibleLightTransmissionPercent:
        input.visibleLightTransmissionPercent as number,
    }),
  description:
    "Score supplied laser-eyewear optical-density adequacy while retaining visible-light transmission.",
  id: "laser/eyewear-od-visibility-score",
  inputs: [
    {
      id: "eyewearOpticalDensity",
      label: "Eyewear optical density",
      kind: "number",
      minimum: 0,
    },
    {
      id: "requiredOpticalDensity",
      label: "Required optical density",
      kind: "number",
      minimum: 0,
    },
    {
      id: "visibleLightTransmissionPercent",
      label: "Visible-light transmission",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "opticalDensityMargin",
      label: "Optical-density margin",
      kind: "number",
    },
    {
      id: "hazardTransmissionFraction",
      label: "Hazard transmission fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "protectionVisibilityScore",
      label: "Protection/visibility score",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
    {
      id: "meetsRequiredDensity",
      label: "Meets required density",
      kind: "boolean",
    },
  ],
  title: "Eyewear OD\u2013Visibility Score",
});

export const run = tool.execute;
export default tool;
