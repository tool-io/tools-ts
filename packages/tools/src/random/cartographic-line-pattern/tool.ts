import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  repertoire,
  unique,
} from "../batch42-shared.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly callerReferenceEdition: string;
  readonly callerVerifiedCartographicLineAssets: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  {
    id: "callerReferenceEdition",
    label: "Caller reference edition",
    kind: "string",
  },
  {
    id: "callerVerifiedCartographicLineAssets",
    label: "Caller verified cartographic line assets",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  if (!input.callerReferenceEdition.trim())
    simpleError(
      "edition",
      "Explicit independently verified reference edition required.",
    );
  unique(input.callerVerifiedCartographicLineAssets, "captioned assets");
  if (input.callerVerifiedCartographicLineAssets.some((v) => !v.trim()))
    simpleError(
      "assets",
      "Nonempty independently verified captioned glyph/asset tokens required.",
    );
  const chosen = repertoire(
    { values: input.callerVerifiedCartographicLineAssets },
    input.callerVerifiedCartographicLineAssets.length,
    input,
    context,
  );
  return {
    result: {
      ...chosen.result,
      callerReferenceEdition: input.callerReferenceEdition,
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    withoutReplacement: false,
    callerReferenceEdition: "caller-verified-edition",
    callerVerifiedCartographicLineAssets: [
      "dashed | caller map legend asset",
      "solid | caller map legend asset",
    ],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/cartographic-line-pattern",
  title: "Random Cartographic Line Pattern Generator",
  description:
    "Randomize explicit independently verified CartographicLine glyph/asset tokens with captions under one stated reference edition. Asset text may include a stable caller reference ID rather than a complete drawing. Not a built-in normative symbol, Morse timing dictionary, certified safety sign, folding/handling instruction or actual operation recommendation; different traditions/editions cannot be inferred.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
