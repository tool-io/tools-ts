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
  readonly observedHerbInterceptLengthsM: readonly number[];
  readonly observedHerbTransectLengthsM: readonly number[];
  readonly callerHerbOverlappingInterceptM: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownLineInterceptCoverPercent: number;
}>;
const inputFields = [
  {
    id: "observedHerbInterceptLengthsM",
    label: "Observed herb intercept lengths m",
    kind: "numberList",
  },
  {
    id: "observedHerbTransectLengthsM",
    label: "Observed herb transect lengths m",
    kind: "numberList",
  },
  {
    id: "callerHerbOverlappingInterceptM",
    label: "Caller herb overlapping intercept m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedHerbTransectLengthsM.forEach((v) =>
    positive(v, "observedHerbTransectLengthsM"),
  );
  input.observedHerbInterceptLengthsM.forEach((v) =>
    nonnegative(v, "observedHerbInterceptLengthsM"),
  );
  input.callerHerbOverlappingInterceptM.forEach((v) =>
    nonnegative(v, "callerHerbOverlappingInterceptM"),
  );
  aligned(
    input.observedHerbInterceptLengthsM,
    input.observedHerbTransectLengthsM,
    "observedHerbInterceptLengthsM",
  );
  aligned(
    input.observedHerbInterceptLengthsM,
    input.callerHerbOverlappingInterceptM,
    "observedHerbInterceptLengthsM",
  );
  const covered = input.observedHerbInterceptLengthsM.map((v, i) => {
    const union = v - input.callerHerbOverlappingInterceptM[i];
    if (union < 0 || union > input.observedHerbTransectLengthsM[i])
      simpleError(
        "union",
        "Independent overlap-corrected line intercept must fit transect.",
      );
    return union;
  });
  return {
    knownLineInterceptCoverPercent:
      (100 * sum(covered)) / sum(input.observedHerbTransectLengthsM),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedHerbInterceptLengthsM: [2, 3],
  observedHerbTransectLengthsM: [4, 6],
  callerHerbOverlappingInterceptM: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  knownLineInterceptCoverPercent: 35,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/herb-cover-percentage",
  title: "Herb Cover Percentage Calculator",
  description:
    "Audit actual herb line-intercept lengths after independent same-layer overlap deduction, not understory point-layer union or aerial canopy area. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedHerbInterceptLengthsM:
        value.observedHerbInterceptLengthsM as readonly number[],
      observedHerbTransectLengthsM:
        value.observedHerbTransectLengthsM as readonly number[],
      callerHerbOverlappingInterceptM:
        value.callerHerbOverlappingInterceptM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
