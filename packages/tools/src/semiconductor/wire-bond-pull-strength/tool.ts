import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedWirePullBreakLoadsN: readonly number[];
  readonly callerBreakLoadEvidenceFlags: readonly number[];
  readonly callerMinimumBreakLoadN: number;
}>;
export type Output = Readonly<{
  readonly knownWirePullMinimumN: number;
  readonly unknownWirePullTestCount: number;
  readonly knownPullTestsBelowCallerMinimum: readonly number[];
}>;
const inputFields = [
  {
    id: "observedWirePullBreakLoadsN",
    label: "Observed wire pull break loads n",
    kind: "numberList",
  },
  {
    id: "callerBreakLoadEvidenceFlags",
    label: "Caller break load evidence flags",
    kind: "numberList",
  },
  {
    id: "callerMinimumBreakLoadN",
    label: "Caller minimum break load n",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedWirePullBreakLoadsN.forEach((v) =>
    nonnegative(v, "observedWirePullBreakLoadsN"),
  );
  nonnegative(input.callerMinimumBreakLoadN, "callerMinimumBreakLoadN");
  binary(input.callerBreakLoadEvidenceFlags, "callerBreakLoadEvidenceFlags");
  aligned(
    input.observedWirePullBreakLoadsN,
    input.callerBreakLoadEvidenceFlags,
    "observedWirePullBreakLoadsN",
  );
  const known = input.observedWirePullBreakLoadsN.filter(
    (_, i) => input.callerBreakLoadEvidenceFlags[i],
  );
  if (!known.length)
    simpleError(
      "evidence",
      "At least one actually observed wire pull break load required.",
    );
  return {
    knownWirePullMinimumN: Math.min(...known),
    unknownWirePullTestCount: input.callerBreakLoadEvidenceFlags.filter(
      (v) => !v,
    ).length,
    knownPullTestsBelowCallerMinimum: input.observedWirePullBreakLoadsN.flatMap(
      (v, i) =>
        input.callerBreakLoadEvidenceFlags[i] &&
        v < input.callerMinimumBreakLoadN
          ? [i]
          : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWirePullBreakLoadsN: [1, 2, 3],
  callerBreakLoadEvidenceFlags: [1, 0, 1],
  callerMinimumBreakLoadN: 2,
} satisfies Input;
export const exampleOutput = {
  knownWirePullMinimumN: 1,
  unknownWirePullTestCount: 1,
  knownPullTestsBelowCallerMinimum: [0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/wire-bond-pull-strength",
  title: "Semiconductor Wire Bond Pull Strength Calculator",
  description:
    "Audit already observed wire-bond break-load evidence separately from missing tests, no destructive testing instructions, bond geometry tensile-strength model or certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownWirePullMinimumN",
      label: "Known wire pull minimum n",
      kind: "number",
    },
    {
      id: "unknownWirePullTestCount",
      label: "Unknown wire pull test count",
      kind: "number",
    },
    {
      id: "knownPullTestsBelowCallerMinimum",
      label: "Known pull tests below caller minimum",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWirePullBreakLoadsN:
        value.observedWirePullBreakLoadsN as readonly number[],
      callerBreakLoadEvidenceFlags:
        value.callerBreakLoadEvidenceFlags as readonly number[],
      callerMinimumBreakLoadN: value.callerMinimumBreakLoadN as number,
    }),
});
export const run = tool.execute;
export default tool;
