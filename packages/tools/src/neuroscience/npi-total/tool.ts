import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  binary,
  bounded,
  positive,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyCodedDomainFrequencies: readonly number[];
  readonly independentlyCodedDomainSeverities: readonly number[];
  readonly domainKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCodedDomainFrequencies",
    label: "Independently coded domain frequencies",
    kind: "numberList",
  },
  {
    id: "independentlyCodedDomainSeverities",
    label: "Independently coded domain severities",
    kind: "numberList",
  },
  { id: "domainKnownFlags", label: "Domain known flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.independentlyCodedDomainFrequencies.length !== 12)
    simpleError("domains", "Declared12-domain NPIversion.");
  aligned(
    input.independentlyCodedDomainFrequencies,
    input.independentlyCodedDomainSeverities,
    "domains",
  );
  aligned(
    input.independentlyCodedDomainFrequencies,
    input.domainKnownFlags,
    "known",
  );
  binary(input.domainKnownFlags, "known");
  input.independentlyCodedDomainFrequencies.forEach((v, i) => {
    bounded(v, "frequency", 0, 4);
    bounded(input.independentlyCodedDomainSeverities[i], "severity", 0, 3);
    if ((v === 0) !== (input.independentlyCodedDomainSeverities[i] === 0))
      simpleError(
        "codes",
        "Absent domain uses both0; present domains use positive independent frequency/severity.",
      );
  });
  const k = sum(
      input.independentlyCodedDomainFrequencies.map(
        (v, i) =>
          v *
          input.independentlyCodedDomainSeverities[i] *
          input.domainKnownFlags[i],
      ),
    ),
    unknown = input.domainKnownFlags.flatMap((v, i) => (v ? [] : [i]));
  return {
    knownNpiTotal: k,
    minimumPossibleTotal: k,
    maximumPossibleTotal: k + 12 * unknown.length,
    unknownDomainIndices: unknown,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCodedDomainFrequencies: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    independentlyCodedDomainSeverities: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    domainKnownFlags: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  output: {
    result: {
      knownNpiTotal: 12,
      minimumPossibleTotal: 12,
      maximumPossibleTotal: 12,
      unknownDomainIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/npi-total",
  title: "NPI Total Calculator",
  description:
    "NPI12domain frequency\u00d7severity aggregation, maximum144; domains independently assessed, absent0paired with0, presentfrequency1\u20134/severity1\u20133. Unknown bounds retained; no caregiver-distress inclusion, NPI-Qsubstitution or diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
