import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nearestSwatches } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedX11Ids: readonly string[];
  readonly callerSameWhiteX11LabSwatches: readonly (readonly number[])[];
  readonly querySameWhiteLab: readonly number[];
}>;
export type Output = Readonly<{
  readonly nearestCallerIds: readonly string[];
  readonly minimumDeclaredSpaceDistance: number;
}>;
const inputFields = [
  {
    id: "callerVerifiedX11Ids",
    label: "Caller verified x11 ids",
    kind: "stringList",
  },
  {
    id: "callerSameWhiteX11LabSwatches",
    label: "Caller same white x11 lab swatches",
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
    input.callerVerifiedX11Ids,
    input.callerSameWhiteX11LabSwatches,
    input.querySameWhiteLab,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedX11Ids: ["a", "b"],
  callerSameWhiteX11LabSwatches: [
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
  id: "color/x11-nearest-color-name-lookup",
  title: "X11 Nearest Color Name Lookup",
  description:
    "Nearest caller independently verified X11 name Lab palette, not CSS named-color alias or single nearest tie suppression. Explicit declared color space/reference and caller applicability; not spectral equivalence, pigment mixing, press readiness or accessibility certification.",
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
      callerVerifiedX11Ids: value.callerVerifiedX11Ids as readonly string[],
      callerSameWhiteX11LabSwatches:
        value.callerSameWhiteX11LabSwatches as readonly (readonly number[])[],
      querySameWhiteLab: value.querySameWhiteLab as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
