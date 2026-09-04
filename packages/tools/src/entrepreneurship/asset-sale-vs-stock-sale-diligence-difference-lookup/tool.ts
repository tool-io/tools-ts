import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAssetStockDiligenceKeys: readonly string[];
  readonly callerVerifiedAssetStockDiligenceNotices: readonly string[];
  readonly queryAssetStockDiligenceKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAssetStockDiligenceKeys",
    label: "Caller verified asset stock diligence keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAssetStockDiligenceNotices",
    label: "Caller verified asset stock diligence notices",
    kind: "stringList",
  },
  {
    id: "queryAssetStockDiligenceKey",
    label: "Query asset stock diligence key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedAssetStockDiligenceKeys,
      input.callerVerifiedAssetStockDiligenceNotices,
      input.queryAssetStockDiligenceKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAssetStockDiligenceKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedAssetStockDiligenceNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryAssetStockDiligenceKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/asset-sale-vs-stock-sale-diligence-difference-lookup",
  title: "Asset Sale vs Stock Sale Diligence Difference Lookup",
  description:
    "Caller independently verified transaction/jurisdiction asset-vs-stock diligence notice, liabilities not inferred from transaction label. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerNotice",
      label: "Matched caller notice",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedAssetStockDiligenceKeys:
        value.callerVerifiedAssetStockDiligenceKeys as readonly string[],
      callerVerifiedAssetStockDiligenceNotices:
        value.callerVerifiedAssetStockDiligenceNotices as readonly string[],
      queryAssetStockDiligenceKey: value.queryAssetStockDiligenceKey as string,
    }),
});
export const run = tool.execute;
export default tool;
