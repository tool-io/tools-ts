import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, curve } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedSousVideThicknessCoordinates: readonly number[];
  readonly callerMatchedSousVideThicknessResponses: readonly number[];
  readonly querySousVideThicknessCoordinate: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResponse: number;
  readonly localObservedSlope: number;
}>;
const inputFields = [
  {
    id: "observedSousVideThicknessCoordinates",
    label: "Observed sous vide thickness coordinates",
    kind: "numberList",
  },
  {
    id: "callerMatchedSousVideThicknessResponses",
    label: "Caller matched sous vide thickness responses",
    kind: "numberList",
  },
  {
    id: "querySousVideThicknessCoordinate",
    label: "Query sous vide thickness coordinate",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedSousVideThicknessCoordinates,
    input.callerMatchedSousVideThicknessResponses,
    "observedSousVideThicknessCoordinates",
  );
  const v = curve(
    input.observedSousVideThicknessCoordinates,
    input.callerMatchedSousVideThicknessResponses,
    input.querySousVideThicknessCoordinate,
  );
  return { interpolatedResponse: v.value, localObservedSlope: v.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSousVideThicknessCoordinates: [10, 20, 30],
  callerMatchedSousVideThicknessResponses: [20, 10, 5],
  querySousVideThicknessCoordinate: 25,
} satisfies Input;
export const exampleOutput = {
  interpolatedResponse: 7.5,
  localObservedSlope: -0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/sous-vide-time-thickness",
  title: "Cooking Sous Vide Time Thickness Calculator",
  description:
    "Same geometry, bath/start conditions observed heating endpoint time vs thickness; not pasteurization lethality or safe holding time. Conditional independently matched piecewise-linear calibration, no extrapolation. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedResponse",
      label: "Interpolated response",
      kind: "number",
    },
    { id: "localObservedSlope", label: "Local observed slope", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedSousVideThicknessCoordinates:
        value.observedSousVideThicknessCoordinates as readonly number[],
      callerMatchedSousVideThicknessResponses:
        value.callerMatchedSousVideThicknessResponses as readonly number[],
      querySousVideThicknessCoordinate:
        value.querySousVideThicknessCoordinate as number,
    }),
});
export const run = tool.execute;
export default tool;
