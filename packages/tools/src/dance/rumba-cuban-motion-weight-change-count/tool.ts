import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedSupportFootCodes: readonly number[];
  readonly supportFootEvidenceFlags: readonly number[];
  readonly callerExpectedWeightChanges: number;
}>;
export type Output = Readonly<{
  readonly knownAdjacentWeightChangeCount: number;
  readonly adjacentTransitionsWithoutEvidenceCount: number;
  readonly signedKnownChangesMinusCallerTarget: number;
}>;
const inputFields = [
  {
    id: "observedSupportFootCodes",
    label: "Observed support foot codes",
    kind: "numberList",
  },
  {
    id: "supportFootEvidenceFlags",
    label: "Support foot evidence flags",
    kind: "numberList",
  },
  {
    id: "callerExpectedWeightChanges",
    label: "Caller expected weight changes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.supportFootEvidenceFlags, "supportFootEvidenceFlags");
  aligned(
    input.observedSupportFootCodes,
    input.supportFootEvidenceFlags,
    "observedSupportFootCodes",
  );
  input.observedSupportFootCodes.forEach((v) =>
    bounded(v, "supportFoot", 0, 1),
  );
  bounded(input.callerExpectedWeightChanges, "target", 0, 10000);
  if (input.observedSupportFootCodes.length < 2)
    simpleError(
      "support",
      "At least two ordered support observations required.",
    );
  let changes = 0,
    unknown = 0;
  for (let i = 1; i < input.observedSupportFootCodes.length; i++) {
    if (
      !input.supportFootEvidenceFlags[i] ||
      !input.supportFootEvidenceFlags[i - 1]
    )
      unknown++;
    else if (
      input.observedSupportFootCodes[i] !==
      input.observedSupportFootCodes[i - 1]
    )
      changes++;
  }
  return {
    knownAdjacentWeightChangeCount: changes,
    adjacentTransitionsWithoutEvidenceCount: unknown,
    signedKnownChangesMinusCallerTarget:
      changes - input.callerExpectedWeightChanges,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSupportFootCodes: [0, 0, 1, 1, 0],
  supportFootEvidenceFlags: [1, 1, 1, 0, 1],
  callerExpectedWeightChanges: 2,
} satisfies Input;
export const exampleOutput = {
  knownAdjacentWeightChangeCount: 1,
  adjacentTransitionsWithoutEvidenceCount: 2,
  signedKnownChangesMinusCallerTarget: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/rumba-cuban-motion-weight-change-count",
  title: "Rumba Cuban Motion Weight Change Count",
  description:
    "Count actual adjacent observed rumba support-foot changes with missing evidence retained rather than bridged; caller supplies expected count, no inference of Cuban hip motion from foot labels.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownAdjacentWeightChangeCount",
      label: "Known adjacent weight change count",
      kind: "number",
    },
    {
      id: "adjacentTransitionsWithoutEvidenceCount",
      label: "Adjacent transitions without evidence count",
      kind: "number",
    },
    {
      id: "signedKnownChangesMinusCallerTarget",
      label: "Signed known changes minus caller target",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSupportFootCodes:
        value.observedSupportFootCodes as readonly number[],
      supportFootEvidenceFlags:
        value.supportFootEvidenceFlags as readonly number[],
      callerExpectedWeightChanges: value.callerExpectedWeightChanges as number,
    }),
});
export const run = tool.execute;
export default tool;
