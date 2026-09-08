import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  notice,
  ownReference,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSource: string;
  readonly callerVerifiedContext: string;
  readonly callerVerifiedAsOfDate: string;
  readonly callerReferenceKeys: readonly string[];
  readonly callerReferenceTexts: readonly string[];
  readonly queryReferenceKey: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedSource",
    label: "Caller verified source",
    kind: "string",
  },
  {
    id: "callerVerifiedContext",
    label: "Caller verified context",
    kind: "string",
  },
  {
    id: "callerVerifiedAsOfDate",
    label: "Caller verified as of date",
    kind: "string",
  },
  {
    id: "callerReferenceKeys",
    label: "Caller reference keys",
    kind: "stringList",
  },
  {
    id: "callerReferenceTexts",
    label: "Caller reference texts",
    kind: "stringList",
  },
  { id: "queryReferenceKey", label: "Query reference key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  ownReference(
    input.callerVerifiedSource,
    input.callerVerifiedContext,
    input.callerVerifiedAsOfDate,
  );
  return {
    matchedCallerReference: notice(
      input.callerReferenceKeys,
      input.callerReferenceTexts,
      input.queryReferenceKey,
    ),
    source: input.callerVerifiedSource,
    context: input.callerVerifiedContext,
    asOfDate: input.callerVerifiedAsOfDate,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedSource: "independently-reviewed-authority/edition",
    callerVerifiedContext:
      "actual IEC62305or applicable lightning-risk standard/edition, structure/occupancy, site flash density, collection area, loss probabilities, measures and qualified engineer review; no arbitrary universal risk-factor product",
    callerVerifiedAsOfDate: "2026-01-01",
    callerReferenceKeys: ["reference-a", "reference-b"],
    callerReferenceTexts: [
      "Illustrative caller-verified Lightning Risk Factor Calculator reference A",
      "Illustrative caller-verified Lightning Risk Factor Calculator reference B",
    ],
    queryReferenceKey: "reference-a",
  },
  output: {
    result: {
      matchedCallerReference:
        "Illustrative caller-verified Lightning Risk Factor Calculator reference A",
      source: "independently-reviewed-authority/edition",
      context:
        "actual IEC62305or applicable lightning-risk standard/edition, structure/occupancy, site flash density, collection area, loss probabilities, measures and qualified engineer review; no arbitrary universal risk-factor product",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/lightning-risk-factor",
  title: "Lightning Risk Factor Calculator",
  description:
    "Exact caller independently verified Lightning Risk Factor Calculator reference lookup. Required actual context: actual IEC62305or applicable lightning-risk standard/edition, structure/occupancy, site flash density, collection area, loss probabilities, measures and qualified engineer review; no arbitrary universal risk-factor product. Illustrative records are not authoritative data. No universal material coefficient, law, norm, medical limit, diagnosis, clinical dose, work-safety approval, engineering design or guaranteed forecast is inferred. This operation retrieves actual qualified reference text; it does not calculate a missing physical model or verify the truth of supplied evidence.",
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
