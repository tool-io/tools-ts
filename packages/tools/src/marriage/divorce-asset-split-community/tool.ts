import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  integer,
  signedSum,
  roundMinor,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerLegallyEstablishedDistributableNetAssetsMinorUnits: number;
  readonly callerLegallyEstablishedFirstPartyBasisPoints: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerLegallyEstablishedDistributableNetAssetsMinorUnits",
    label: "Caller legally established distributable net assets minor units",
    kind: "number",
  },
  {
    id: "callerLegallyEstablishedFirstPartyBasisPoints",
    label: "Caller legally established first party basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  integer(
    input.callerLegallyEstablishedDistributableNetAssetsMinorUnits,
    "netassets",
  );
  bounded(
    input.callerLegallyEstablishedFirstPartyBasisPoints,
    "basispoints",
    0,
    10000,
  );
  const a = roundMinor(
    BigInt(input.callerLegallyEstablishedDistributableNetAssetsMinorUnits) *
      BigInt(input.callerLegallyEstablishedFirstPartyBasisPoints),
    10000n,
  );
  return {
    conditionalFirstPartyAllocationMinorUnits: a,
    conditionalSecondPartyResidualMinorUnits: signedSum([
      input.callerLegallyEstablishedDistributableNetAssetsMinorUnits,
      -a,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerLegallyEstablishedDistributableNetAssetsMinorUnits: 101,
    callerLegallyEstablishedFirstPartyBasisPoints: 5000,
  },
  output: {
    result: {
      conditionalFirstPartyAllocationMinorUnits: 51,
      conditionalSecondPartyResidualMinorUnits: 50,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/divorce-asset-split-community",
  title: "Community Property Asset Split Calculator",
  description:
    "Reconcile independently legally determined community-property inventory and court-approved split, not automatic classification of assets. Exact safe-integer signed net assets\u00d7caller basispoints/10000, half-away rounding first party, second receives exact residual. One currency; no ownership, alimony, tax, safety or legal advice.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
