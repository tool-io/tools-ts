import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  rgb3,
  nearestSwatches,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerShadeIds: readonly string[];
  readonly callerMatchedRgbCoordinates: readonly (readonly number[])[];
  readonly observedRgbCoordinates: readonly number[];
}>;
export type Output = Readonly<{
  readonly nearestCallerIds: readonly string[];
  readonly minimumDeclaredSpaceDistance: number;
}>;
const inputFields = [
  { id: "callerShadeIds", label: "Caller shade ids", kind: "stringList" },
  {
    id: "callerMatchedRgbCoordinates",
    label: "Caller matched rgb coordinates",
    kind: "matrix",
  },
  {
    id: "observedRgbCoordinates",
    label: "Observed rgb coordinates",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  rgb3(input.observedRgbCoordinates, "observedRGB");
  input.callerMatchedRgbCoordinates.forEach((v) => rgb3(v, "referenceRGB"));
  return nearestSwatches(
    input.callerShadeIds,
    input.callerMatchedRgbCoordinates,
    input.observedRgbCoordinates,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerShadeIds: ["a", "b", "c"],
  callerMatchedRgbCoordinates: [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
  ],
  observedRgbCoordinates: [0.5, 0, 0],
} satisfies Input;
export const exampleOutput = {
  nearestCallerIds: ["a", "b"],
  minimumDeclaredSpaceDistance: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/shade-key-nearest-match-finder",
  title: "Shade Key RGB Distance Nearest Match Finder",
  description:
    "Find all exact Euclidean ties in caller common normalized encoded RGB; not perceptual color difference or catalogue attribution. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerShadeIds: value.callerShadeIds as readonly string[],
      callerMatchedRgbCoordinates:
        value.callerMatchedRgbCoordinates as readonly (readonly number[])[],
      observedRgbCoordinates: value.observedRgbCoordinates as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
