import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerUnderlyingSOrCZSet: readonly number[];
  readonly observedSThetaOtherRealizationCodes: readonly number[];
}>;
export type Output = Readonly<{
  readonly sSetObservedSRealizationPercent: number;
  readonly czSetObservedThetaRealizationPercent: number;
  readonly bothUnderlyingSetsObserved: boolean;
  readonly matchesObservedDistincionPattern: boolean;
}>;
const inputFields = [
  {
    id: "callerUnderlyingSOrCZSet",
    label: "Caller underlying s or c z set",
    kind: "numberList",
  },
  {
    id: "observedSThetaOtherRealizationCodes",
    label: "Observed s theta other realization codes",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerUnderlyingSOrCZSet,
    input.observedSThetaOtherRealizationCodes,
    "callerUnderlyingSOrCZSet",
  );
  input.callerUnderlyingSOrCZSet.forEach((v) => bounded(v, "set", 0, 1));
  input.observedSThetaOtherRealizationCodes.forEach((v) =>
    bounded(v, "realization", 0, 2),
  );
  const s = input.observedSThetaOtherRealizationCodes.filter(
      (_, i) => input.callerUnderlyingSOrCZSet[i] === 0,
    ),
    z = input.observedSThetaOtherRealizationCodes.filter(
      (_, i) => input.callerUnderlyingSOrCZSet[i] === 1,
    ),
    both = s.length > 0 && z.length > 0;
  return {
    sSetObservedSRealizationPercent: s.length
      ? (100 * s.filter((v) => v === 0).length) / s.length
      : -1,
    czSetObservedThetaRealizationPercent: z.length
      ? (100 * z.filter((v) => v === 1).length) / z.length
      : -1,
    bothUnderlyingSetsObserved: both,
    matchesObservedDistincionPattern:
      both && s.every((v) => v === 0) && z.every((v) => v === 1),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerUnderlyingSOrCZSet: [0, 1],
  observedSThetaOtherRealizationCodes: [0, 1],
} satisfies Input;
export const exampleOutput = {
  sSetObservedSRealizationPercent: 100,
  czSetObservedThetaRealizationPercent: 100,
  bothUnderlyingSetsObserved: true,
  matchesObservedDistincionPattern: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/castilian-theta-distincion-checker",
  title: "Castilian Distinción Theta Check",
  description:
    "Audit explicitly annotated Spanish lexical s versus c/z sets and observed s/θ/other realizations, preserving missing evidence; supports distinction screening, not national/regional stereotypes or inferred pronunciation from spelling.",
  inputs: inputFields,
  outputs: [
    {
      id: "sSetObservedSRealizationPercent",
      label: "S set observed s realization percent",
      kind: "number",
    },
    {
      id: "czSetObservedThetaRealizationPercent",
      label: "Cz set observed theta realization percent",
      kind: "number",
    },
    {
      id: "bothUnderlyingSetsObserved",
      label: "Both underlying sets observed",
      kind: "boolean",
    },
    {
      id: "matchesObservedDistincionPattern",
      label: "Matches observed distincion pattern",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerUnderlyingSOrCZSet:
        value.callerUnderlyingSOrCZSet as readonly number[],
      observedSThetaOtherRealizationCodes:
        value.observedSThetaOtherRealizationCodes as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
