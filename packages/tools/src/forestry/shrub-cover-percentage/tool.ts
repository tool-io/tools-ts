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
  aligned,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedShrubInterceptLengthsM: readonly number[];
  readonly observedShrubTransectLengthsM: readonly number[];
  readonly callerShrubOverlappingInterceptM: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownLineInterceptCoverPercent: number;
}>;
const inputFields = [
  {
    id: "observedShrubInterceptLengthsM",
    label: "Observed shrub intercept lengths m",
    kind: "numberList",
  },
  {
    id: "observedShrubTransectLengthsM",
    label: "Observed shrub transect lengths m",
    kind: "numberList",
  },
  {
    id: "callerShrubOverlappingInterceptM",
    label: "Caller shrub overlapping intercept m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedShrubTransectLengthsM.forEach((v) =>
    positive(v, "observedShrubTransectLengthsM"),
  );
  input.observedShrubInterceptLengthsM.forEach((v) =>
    nonnegative(v, "observedShrubInterceptLengthsM"),
  );
  input.callerShrubOverlappingInterceptM.forEach((v) =>
    nonnegative(v, "callerShrubOverlappingInterceptM"),
  );
  aligned(
    input.observedShrubInterceptLengthsM,
    input.observedShrubTransectLengthsM,
    "observedShrubInterceptLengthsM",
  );
  aligned(
    input.observedShrubInterceptLengthsM,
    input.callerShrubOverlappingInterceptM,
    "observedShrubInterceptLengthsM",
  );
  const covered = input.observedShrubInterceptLengthsM.map((v, i) => {
    const union = v - input.callerShrubOverlappingInterceptM[i];
    if (union < 0 || union > input.observedShrubTransectLengthsM[i])
      simpleError(
        "union",
        "Independent overlap-corrected line intercept must fit transect.",
      );
    return union;
  });
  return {
    knownLineInterceptCoverPercent:
      (100 * sum(covered)) / sum(input.observedShrubTransectLengthsM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShrubInterceptLengthsM: [2, 3],
  observedShrubTransectLengthsM: [4, 6],
  callerShrubOverlappingInterceptM: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  knownLineInterceptCoverPercent: 35,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/shrub-cover-percentage",
  title: "Shrub Cover Percentage Calculator",
  description:
    "Audit actual shrub line-intercept lengths after independent same-layer overlap deduction, not understory point-layer union or aerial canopy area. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownLineInterceptCoverPercent",
      label: "Known line intercept cover percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedShrubInterceptLengthsM:
        value.observedShrubInterceptLengthsM as readonly number[],
      observedShrubTransectLengthsM:
        value.observedShrubTransectLengthsM as readonly number[],
      callerShrubOverlappingInterceptM:
        value.callerShrubOverlappingInterceptM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
