import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nearestSwatches } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedBootstrapIds: readonly string[];
  readonly callerSameWhiteBootstrapLabSwatches: readonly (readonly number[])[];
  readonly querySameWhiteLab: readonly number[];
}>;
export type Output = Readonly<{
  readonly nearestCallerIds: readonly string[];
  readonly minimumDeclaredSpaceDistance: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedBootstrapIds",
    label: "Caller verified bootstrap ids",
    kind: "stringList",
  },
  {
    id: "callerSameWhiteBootstrapLabSwatches",
    label: "Caller same white bootstrap lab swatches",
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
    input.callerVerifiedBootstrapIds,
    input.callerSameWhiteBootstrapLabSwatches,
    input.querySameWhiteLab,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedBootstrapIds: ["a", "b"],
  callerSameWhiteBootstrapLabSwatches: [
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
  id: "color/bootstrap-theme-color-nearest-lookup",
  title: "Bootstrap Theme Color Nearest Lookup",
  description:
    "Nearest caller framework/version Bootstrap theme Lab reference, semantic label not inferred from hue. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
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
      callerVerifiedBootstrapIds:
        value.callerVerifiedBootstrapIds as readonly string[],
      callerSameWhiteBootstrapLabSwatches:
        value.callerSameWhiteBootstrapLabSwatches as readonly (readonly number[])[],
      querySameWhiteLab: value.querySameWhiteLab as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
