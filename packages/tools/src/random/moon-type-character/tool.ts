import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
  ownReference,
  repertoire,
} from "../batch53-shared.js";

export type Input = Readonly<{
  seed: string;
  count: number;
  withoutReplacement: boolean;
  callerVerifiedSource: string;
  callerVerifiedContext: string;
  callerVerifiedAsOfDate: string;
  callerVerifiedAssets: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
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
    id: "callerVerifiedAssets",
    label: "Caller verified assets",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  ownReference(
    i.callerVerifiedSource,
    i.callerVerifiedContext,
    i.callerVerifiedAsOfDate,
  );
  if (i.callerVerifiedAssets.some((v) => !v.trim()))
    simpleError(
      "assets",
      "Independently qualified nonempty glyph/asset tokens.",
    );
  unique(i.callerVerifiedAssets, "assets");
  const r = repertoire(
    { values: i.callerVerifiedAssets },
    i.callerVerifiedAssets.length,
    i,
    context,
  );
  return {
    ...r.result,
    source: i.callerVerifiedSource,
    context: i.callerVerifiedContext,
    asOfDate: i.callerVerifiedAsOfDate,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    seed: "tool.io/batch53",
    count: 1,
    withoutReplacement: true,
    callerVerifiedSource: "illustrative-qualified-reference/edition",
    callerVerifiedContext:
      "Illustrative independently checked topic-specific record, not an authoritative default.",
    callerVerifiedAsOfDate: "2026-01-01",
    callerVerifiedAssets: ["caller-qualified Moon letter asset"],
  },
  output: {
    result: {
      values: ["caller-qualified Moon letter asset"],
      selectedEntryIndices: [0],
      repertoireSize: 1,
      source: "illustrative-qualified-reference/edition",
      context:
        "Illustrative independently checked topic-specific record, not an authoritative default.",
      asOfDate: "2026-01-01",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/moon-type-character",
  title: "Random Moon Type Character Generator",
  description:
    "Randomize explicit independently qualified Moon-type tactile character glyph assets using the existing repertoire sampler and one advancing random source. No built-in glyph drawing, authoritative repertoire, railway operating instruction or tactile readability guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
