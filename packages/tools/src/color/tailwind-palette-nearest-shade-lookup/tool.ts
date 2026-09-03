import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nearestSwatches } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTailwindIds: readonly string[];
  readonly callerSameWhiteTailwindLabSwatches: readonly (readonly number[])[];
  readonly querySameWhiteLab: readonly number[];
}>;
export type Output = Readonly<{
  readonly nearestCallerIds: readonly string[];
  readonly minimumDeclaredSpaceDistance: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedTailwindIds",
    label: "Caller verified tailwind ids",
    kind: "stringList",
  },
  {
    id: "callerSameWhiteTailwindLabSwatches",
    label: "Caller same white tailwind lab swatches",
    kind: "matrix",
  },
  {
    id: "querySameWhiteLab",
    label: "Query same white lab",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return nearestSwatches(
    input.callerVerifiedTailwindIds,
    input.callerSameWhiteTailwindLabSwatches,
    input.querySameWhiteLab,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTailwindIds: ["a", "b"],
  callerSameWhiteTailwindLabSwatches: [
    [50, 0, 0],
    [50, 3, 4],
  ],
  querySameWhiteLab: [50, 3, 4],
} satisfies Input;
export const exampleOutput = {
  nearestCallerIds: ["b"],
  minimumDeclaredSpaceDistance: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/tailwind-palette-nearest-shade-lookup",
  title: "Tailwind Palette Nearest Shade Lookup",
  description:
    "Nearest caller exact framework/version Tailwind shade Lab reference with ties retained, no bundled current palette. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
  inputs: inputFields,
  outputs: [
    { id: "nearestCallerIds", label: "Nearest caller ids", kind: "stringList" },
    {
      id: "minimumDeclaredSpaceDistance",
      label: "Minimum declared space distance",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedTailwindIds:
        value.callerVerifiedTailwindIds as readonly string[],
      callerSameWhiteTailwindLabSwatches:
        value.callerSameWhiteTailwindLabSwatches as readonly (readonly number[])[],
      querySameWhiteLab: value.querySameWhiteLab as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
