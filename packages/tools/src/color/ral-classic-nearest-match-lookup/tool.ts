import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nearestSwatches } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedRalIds: readonly string[];
  readonly callerSameWhiteRalLabSwatches: readonly (readonly number[])[];
  readonly querySameWhiteLab: readonly number[];
}>;
export type Output = Readonly<{
  readonly nearestCallerIds: readonly string[];
  readonly minimumDeclaredSpaceDistance: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedRalIds",
    label: "Caller verified ral ids",
    kind: "stringList",
  },
  {
    id: "callerSameWhiteRalLabSwatches",
    label: "Caller same white ral lab swatches",
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
    input.callerVerifiedRalIds,
    input.callerSameWhiteRalLabSwatches,
    input.querySameWhiteLab,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedRalIds: ["a", "b"],
  callerSameWhiteRalLabSwatches: [
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
  id: "color/ral-classic-nearest-match-lookup",
  title: "RAL Classic Nearest Match Lookup",
  description:
    "Approximate nearest caller independently verified RAL Classic swatches in same-white Lab, not paint-formulation match. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
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
      callerVerifiedRalIds: value.callerVerifiedRalIds as readonly string[],
      callerSameWhiteRalLabSwatches:
        value.callerSameWhiteRalLabSwatches as readonly (readonly number[])[],
      querySameWhiteLab: value.querySameWhiteLab as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
