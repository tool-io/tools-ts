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
  aligned,
  binary,
  sum,
  sumMoney,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedResolvedSubrogationCaseFlags: readonly number[];
  readonly observedSuccessfulRecoveryFlags: readonly number[];
  readonly observedGrossRecoveryMinor: readonly number[];
  readonly observedCollectionCostsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly resolvedSubrogationSuccessPercent: number;
  readonly unresolvedSubrogationCaseCount: number;
  readonly netKnownSubrogationRecoveryMinor: number;
}>;
const inputFields = [
  {
    id: "observedResolvedSubrogationCaseFlags",
    label: "Observed resolved subrogation case flags",
    kind: "numberList",
  },
  {
    id: "observedSuccessfulRecoveryFlags",
    label: "Observed successful recovery flags",
    kind: "numberList",
  },
  {
    id: "observedGrossRecoveryMinor",
    label: "Observed gross recovery minor",
    kind: "numberList",
  },
  {
    id: "observedCollectionCostsMinor",
    label: "Observed collection costs minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.observedResolvedSubrogationCaseFlags, "resolved");
  binary(input.observedSuccessfulRecoveryFlags, "successful");
  for (const list of [
    input.observedSuccessfulRecoveryFlags,
    input.observedGrossRecoveryMinor,
    input.observedCollectionCostsMinor,
  ])
    aligned(input.observedResolvedSubrogationCaseFlags, list, "cases");
  [
    ...input.observedGrossRecoveryMinor,
    ...input.observedCollectionCostsMinor,
  ].forEach((v) => money(v));
  if (
    input.observedSuccessfulRecoveryFlags.some(
      (v, i) => v && !input.observedResolvedSubrogationCaseFlags[i],
    )
  )
    simpleError(
      "evidence",
      "Unresolved cases cannot count as successful resolutions.",
    );
  const resolved = sum(input.observedResolvedSubrogationCaseFlags);
  positive(resolved, "resolvedCases");
  return {
    resolvedSubrogationSuccessPercent:
      (100 * sum(input.observedSuccessfulRecoveryFlags)) / resolved,
    unresolvedSubrogationCaseCount:
      input.observedResolvedSubrogationCaseFlags.length - resolved,
    netKnownSubrogationRecoveryMinor:
      sumMoney(
        input.observedGrossRecoveryMinor.filter(
          (_, i) => input.observedResolvedSubrogationCaseFlags[i],
        ),
      ) -
      sumMoney(
        input.observedCollectionCostsMinor.filter(
          (_, i) => input.observedResolvedSubrogationCaseFlags[i],
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedResolvedSubrogationCaseFlags: [1, 1, 0],
  observedSuccessfulRecoveryFlags: [1, 0, 0],
  observedGrossRecoveryMinor: [1000, 0, 0],
  observedCollectionCostsMinor: [100, 200, 0],
} satisfies Input;
export const exampleOutput = {
  resolvedSubrogationSuccessPercent: 50,
  unresolvedSubrogationCaseCount: 1,
  netKnownSubrogationRecoveryMinor: 700,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/subrogation-recovery-success-rate-percent",
  title: "Subrogation Recovery Success Rate Percent Calculator",
  description:
    "Audit actual resolved versus unresolved subrogation outcomes and independent recovery/cost ledger; not censored-as-failure, universal success odds or legal recovery right.",
  inputs: inputFields,
  outputs: [
    {
      id: "resolvedSubrogationSuccessPercent",
      label: "Resolved subrogation success percent",
      kind: "number",
    },
    {
      id: "unresolvedSubrogationCaseCount",
      label: "Unresolved subrogation case count",
      kind: "number",
    },
    {
      id: "netKnownSubrogationRecoveryMinor",
      label: "Net known subrogation recovery minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedResolvedSubrogationCaseFlags:
        value.observedResolvedSubrogationCaseFlags as readonly number[],
      observedSuccessfulRecoveryFlags:
        value.observedSuccessfulRecoveryFlags as readonly number[],
      observedGrossRecoveryMinor:
        value.observedGrossRecoveryMinor as readonly number[],
      observedCollectionCostsMinor:
        value.observedCollectionCostsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
