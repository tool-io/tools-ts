import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  unique,
} from "../batch45-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTargetTypeIds: readonly string[];
  readonly callerOwnedTypeIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerVerifiedTargetTypeIds",
    label: "Caller verified target type ids",
    kind: "stringList",
  },
  {
    id: "callerOwnedTypeIds",
    label: "Caller owned type ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerVerifiedTargetTypeIds, "targettypes");
  if (input.callerOwnedTypeIds.some((v) => !v.trim()))
    simpleError("owned", "Explicit nonempty owned-type IDs.");
  const owned = [...new Set(input.callerOwnedTypeIds)];
  return {
    missingTargetTypeIds: input.callerVerifiedTargetTypeIds.filter(
      (v) => !owned.includes(v),
    ),
    distinctOwnedTargetCount: input.callerVerifiedTargetTypeIds.filter((v) =>
      owned.includes(v),
    ).length,
    ownedOutsideTargetIds: owned.filter(
      (v) => !input.callerVerifiedTargetTypeIds.includes(v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerVerifiedTargetTypeIds: ["lion", "griffin", "dragon"],
    callerOwnedTypeIds: ["lion", "lion", "extra"],
  },
  output: {
    result: {
      missingTargetTypeIds: ["griffin", "dragon"],
      distinctOwnedTargetCount: 1,
      ownedOutsideTargetIds: ["extra"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/queens-beasts-royal-arms-series-completion-set-builder",
  title: "Queens Beasts Royal Arms Series Completion Set Builder",
  description:
    "Construct actual Queens Beasts/Royal Arms series wantlist using caller independently verified issue/format-specific target IDs, retaining duplicates as ownership but counting distinct targets and outside inventory. No invented universal product checklist or scalar-completion alias.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
