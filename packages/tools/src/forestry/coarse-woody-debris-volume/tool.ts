import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedIntersectDiametersM: readonly number[];
  readonly observedTransectLengthsM: readonly number[];
  readonly callerUnbiasedLineIntersectProtocolVerified: boolean;
}>;
export type Output = Readonly<{
  readonly lineIntersectCoarseDeadwoodM3Ha: number;
}>;
const inputFields = [
  {
    id: "observedIntersectDiametersM",
    label: "Observed intersect diameters m",
    kind: "numberList",
  },
  {
    id: "observedTransectLengthsM",
    label: "Observed transect lengths m",
    kind: "numberList",
  },
  {
    id: "callerUnbiasedLineIntersectProtocolVerified",
    label: "Caller unbiased line intersect protocol verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedTransectLengthsM.forEach((v) =>
    positive(v, "observedTransectLengthsM"),
  );
  input.observedIntersectDiametersM.forEach((v) =>
    nonnegative(v, "observedIntersectDiametersM"),
  );
  if (!input.callerUnbiasedLineIntersectProtocolVerified)
    simpleError(
      "protocol",
      "Independent line-intersect orientation/diameter protocol verification required.",
    );
  return {
    lineIntersectCoarseDeadwoodM3Ha:
      (10000 *
        Math.PI ** 2 *
        sum(input.observedIntersectDiametersM.map((v) => v * v))) /
      (8 * sum(input.observedTransectLengthsM)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIntersectDiametersM: [0.1, 0.2],
  observedTransectLengthsM: [10, 20],
  callerUnbiasedLineIntersectProtocolVerified: true,
} satisfies Input;
export const exampleOutput = {
  lineIntersectCoarseDeadwoodM3Ha: 20.56167583560283,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/coarse-woody-debris-volume",
  title: "Coarse Woody Debris Volume Calculator",
  description:
    "Named line-intersect coarse deadwood volume estimator π²Σd²/(8L)×10000, measured diameters/metres and transect exposure, distinct from complete-log frustum inventory. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "lineIntersectCoarseDeadwoodM3Ha",
      label: "Line intersect coarse deadwood m3 ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIntersectDiametersM:
        value.observedIntersectDiametersM as readonly number[],
      observedTransectLengthsM:
        value.observedTransectLengthsM as readonly number[],
      callerUnbiasedLineIntersectProtocolVerified:
        value.callerUnbiasedLineIntersectProtocolVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
