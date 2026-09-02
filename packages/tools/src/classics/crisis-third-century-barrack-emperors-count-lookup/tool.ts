import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  sum,
} from "../batch44-shared.js";

export type Input = Readonly<{
  readonly callerDistinctRulerIds: readonly string[];
  readonly independentlyAttestedRulerFlags: readonly number[];
  readonly attestationKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerDistinctRulerIds",
    label: "Caller distinct ruler ids",
    kind: "stringList",
  },
  {
    id: "independentlyAttestedRulerFlags",
    label: "Independently attested ruler flags",
    kind: "numberList",
  },
  {
    id: "attestationKnownFlags",
    label: "Attestation known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerDistinctRulerIds, "distinctrulers");
  aligned(
    input.callerDistinctRulerIds,
    input.independentlyAttestedRulerFlags,
    "attestation",
  );
  aligned(input.callerDistinctRulerIds, input.attestationKnownFlags, "known");
  binary(input.independentlyAttestedRulerFlags, "attestation");
  binary(input.attestationKnownFlags, "known");
  return {
    knownAttestedRulerCount: sum(
      input.independentlyAttestedRulerFlags.map(
        (v, i) => v * input.attestationKnownFlags[i],
      ),
    ),
    knownExcludedCount: sum(
      input.independentlyAttestedRulerFlags.map(
        (v, i) => (1 - v) * input.attestationKnownFlags[i],
      ),
    ),
    unknownAttestationCount: input.attestationKnownFlags.filter((v) => !v)
      .length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerDistinctRulerIds: ["ruler-a", "ruler-b", "claimant-c"],
    independentlyAttestedRulerFlags: [1, 1, 0],
    attestationKnownFlags: [1, 0, 1],
  },
  output: {
    result: {
      knownAttestedRulerCount: 1,
      knownExcludedCount: 1,
      unknownAttestationCount: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/crisis-third-century-barrack-emperors-count-lookup",
  title: "Crisis Third Century Barrack Emperors Count Lookup",
  description:
    "Count actual caller distinct third-century ruler/claimant records under independently verified inclusion and period criteria. Unknown claims retained; no universally exact barracks-emperor count or complete imperial list fabricated.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
