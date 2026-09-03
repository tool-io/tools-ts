import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nearestSwatches } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedCrayolaIds: readonly string[];
  readonly callerSameWhiteCrayolaLabSwatches: readonly (readonly number[])[];
  readonly querySameWhiteLab: readonly number[];
}>;
export type Output = Readonly<{
  readonly nearestCallerIds: readonly string[];
  readonly minimumDeclaredSpaceDistance: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedCrayolaIds",
    label: "Caller verified crayola ids",
    kind: "stringList",
  },
  {
    id: "callerSameWhiteCrayolaLabSwatches",
    label: "Caller same white crayola lab swatches",
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
    input.callerVerifiedCrayolaIds,
    input.callerSameWhiteCrayolaLabSwatches,
    input.querySameWhiteLab,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedCrayolaIds: ["a", "b"],
  callerSameWhiteCrayolaLabSwatches: [
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
  id: "color/crayola-nearest-color-name-lookup",
  title: "Crayola Nearest Color Name Lookup",
  description:
    "Nearest caller edition/medium Crayola Lab palette, not pigment formulation or invented brand swatches. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
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
      callerVerifiedCrayolaIds:
        value.callerVerifiedCrayolaIds as readonly string[],
      callerSameWhiteCrayolaLabSwatches:
        value.callerSameWhiteCrayolaLabSwatches as readonly (readonly number[])[],
      querySameWhiteLab: value.querySameWhiteLab as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
