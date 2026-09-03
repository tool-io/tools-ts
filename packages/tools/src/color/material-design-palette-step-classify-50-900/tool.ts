import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  strictlyIncreasing,
  nearestSwatches,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerMaterialEditionSteps: readonly number[];
  readonly callerMaterialSameWhiteLab: readonly (readonly number[])[];
  readonly querySameWhiteLab: readonly number[];
}>;
export type Output = Readonly<{
  readonly nearestCallerStepNumbers: readonly number[];
  readonly minimumLabDistance: number;
}>;
const inputFields = [
  {
    id: "callerMaterialEditionSteps",
    label: "Caller material edition steps",
    kind: "numberList",
  },
  {
    id: "callerMaterialSameWhiteLab",
    label: "Caller material same white lab",
    kind: "matrix",
  },
  {
    id: "querySameWhiteLab",
    label: "Query same white lab",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerMaterialEditionSteps,
    input.callerMaterialSameWhiteLab,
    "steps",
  );
  strictlyIncreasing(input.callerMaterialEditionSteps, "steps");
  input.callerMaterialEditionSteps.forEach((v) => {
    if (![50, 100, 200, 300, 400, 500, 600, 700, 800, 900].includes(v))
      simpleError(
        "step",
        "DeclaredMaterial 50..900 steps only, no accentAsteps.",
      );
  });
  const ids = input.callerMaterialEditionSteps.map(String),
    r = nearestSwatches(
      ids,
      input.callerMaterialSameWhiteLab,
      input.querySameWhiteLab,
    );
  return {
    nearestCallerStepNumbers: r.nearestCallerIds.map(Number),
    minimumLabDistance: r.minimumDeclaredSpaceDistance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerMaterialEditionSteps: [50, 100, 200],
  callerMaterialSameWhiteLab: [
    [50, 0, 0],
    [50, 3, 4],
    [50, 6, 8],
  ],
  querySameWhiteLab: [50, 3, 4],
} satisfies Input;
export const exampleOutput = {
  nearestCallerStepNumbers: [100],
  minimumLabDistance: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/material-design-palette-step-classify-50-900",
  title: "Material Palette Step Classify (50–900)",
  description:
    "Classify actual color against independently supplied edition-specific Material numeric shade references, not infer uniform perceptual step spacing. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "nearestCallerStepNumbers",
      label: "Nearest caller step numbers",
      kind: "numberList",
    },
    { id: "minimumLabDistance", label: "Minimum lab distance", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerMaterialEditionSteps:
        value.callerMaterialEditionSteps as readonly number[],
      callerMaterialSameWhiteLab:
        value.callerMaterialSameWhiteLab as readonly (readonly number[])[],
      querySameWhiteLab: value.querySameWhiteLab as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
