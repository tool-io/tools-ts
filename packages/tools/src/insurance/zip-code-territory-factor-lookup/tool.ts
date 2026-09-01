import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  weightedMinor,
  catalog,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerTerritoryKeyIds: readonly string[];
  readonly callerVerifiedTerritoryFactorBasisPoints: readonly number[];
  readonly queryTerritoryKeyId: string;
  readonly callerUntieredAnnualPremiumMinor: number;
}>;
export type Output = Readonly<{
  readonly callerMatchedTerritoryFactorBasisPoints: number;
  readonly callerTerritoryAdjustedPremiumMinor: number;
}>;
const inputFields = [
  {
    id: "callerTerritoryKeyIds",
    label: "Caller territory key ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTerritoryFactorBasisPoints",
    label: "Caller verified territory factor basis points",
    kind: "numberList",
  },
  {
    id: "queryTerritoryKeyId",
    label: "Query territory key id",
    kind: "string",
  },
  {
    id: "callerUntieredAnnualPremiumMinor",
    label: "Caller untiered annual premium minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedTerritoryFactorBasisPoints.forEach((v) =>
    bounded(v, "factor", 0, 100000),
  );
  money(input.callerUntieredAnnualPremiumMinor);
  const factor = catalog(
    input.callerTerritoryKeyIds,
    input.callerVerifiedTerritoryFactorBasisPoints,
    input.queryTerritoryKeyId,
  );
  return {
    callerMatchedTerritoryFactorBasisPoints: factor,
    callerTerritoryAdjustedPremiumMinor: weightedMinor(
      input.callerUntieredAnnualPremiumMinor,
      factor,
      10000,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTerritoryKeyIds: ["00123:edition", "10001:edition"],
  callerVerifiedTerritoryFactorBasisPoints: [12000, 9000],
  queryTerritoryKeyId: "00123:edition",
  callerUntieredAnnualPremiumMinor: 10000,
} satisfies Input;
export const exampleOutput = {
  callerMatchedTerritoryFactorBasisPoints: 12000,
  callerTerritoryAdjustedPremiumMinor: 12000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/zip-code-territory-factor-lookup",
  title: "Zip Code Territory Factor Lookup",
  description:
    "Audit caller verified full territory/rate-edition key and factor, preserving ZIP leading zeros as text; no inferred ZIP geographic risk or territorial/legal rating approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMatchedTerritoryFactorBasisPoints",
      label: "Caller matched territory factor basis points",
      kind: "number",
    },
    {
      id: "callerTerritoryAdjustedPremiumMinor",
      label: "Caller territory adjusted premium minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTerritoryKeyIds: value.callerTerritoryKeyIds as readonly string[],
      callerVerifiedTerritoryFactorBasisPoints:
        value.callerVerifiedTerritoryFactorBasisPoints as readonly number[],
      queryTerritoryKeyId: value.queryTerritoryKeyId as string,
      callerUntieredAnnualPremiumMinor:
        value.callerUntieredAnnualPremiumMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
