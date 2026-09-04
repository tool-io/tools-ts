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
  readonly observedMossInterceptLengthsM: readonly number[];
  readonly observedMossTransectLengthsM: readonly number[];
  readonly callerMossOverlappingInterceptM: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownLineInterceptCoverPercent: number;
}>;
const inputFields = [
  {
    id: "observedMossInterceptLengthsM",
    label: "Observed moss intercept lengths m",
    kind: "numberList",
  },
  {
    id: "observedMossTransectLengthsM",
    label: "Observed moss transect lengths m",
    kind: "numberList",
  },
  {
    id: "callerMossOverlappingInterceptM",
    label: "Caller moss overlapping intercept m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMossTransectLengthsM.forEach((v) =>
    positive(v, "observedMossTransectLengthsM"),
  );
  input.observedMossInterceptLengthsM.forEach((v) =>
    nonnegative(v, "observedMossInterceptLengthsM"),
  );
  input.callerMossOverlappingInterceptM.forEach((v) =>
    nonnegative(v, "callerMossOverlappingInterceptM"),
  );
  aligned(
    input.observedMossInterceptLengthsM,
    input.observedMossTransectLengthsM,
    "observedMossInterceptLengthsM",
  );
  aligned(
    input.observedMossInterceptLengthsM,
    input.callerMossOverlappingInterceptM,
    "observedMossInterceptLengthsM",
  );
  const covered = input.observedMossInterceptLengthsM.map((v, i) => {
    const union = v - input.callerMossOverlappingInterceptM[i];
    if (union < 0 || union > input.observedMossTransectLengthsM[i])
      simpleError(
        "union",
        "Independent overlap-corrected line intercept must fit transect.",
      );
    return union;
  });
  return {
    knownLineInterceptCoverPercent:
      (100 * sum(covered)) / sum(input.observedMossTransectLengthsM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMossInterceptLengthsM: [2, 3],
  observedMossTransectLengthsM: [4, 6],
  callerMossOverlappingInterceptM: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  knownLineInterceptCoverPercent: 35,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/moss-cover-percentage",
  title: "Moss Cover Percentage Calculator",
  description:
    "Audit actual moss line-intercept lengths after independent same-layer overlap deduction, not understory point-layer union or aerial canopy area. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedMossInterceptLengthsM:
        value.observedMossInterceptLengthsM as readonly number[],
      observedMossTransectLengthsM:
        value.observedMossTransectLengthsM as readonly number[],
      callerMossOverlappingInterceptM:
        value.callerMossOverlappingInterceptM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
