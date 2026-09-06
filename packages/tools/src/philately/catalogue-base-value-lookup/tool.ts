import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  unique,
  money,
} from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerEditionCurrencyQualifiedKeys: readonly string[];
  readonly callerCatalogueValuesMinor: readonly number[];
  readonly queryKey: string;
}>;
export type Output = Readonly<{ readonly catalogueValueMinor: number }>;
const inputFields = [
  {
    id: "callerEditionCurrencyQualifiedKeys",
    label: "Caller edition currency qualified keys",
    kind: "stringList",
  },
  {
    id: "callerCatalogueValuesMinor",
    label: "Caller catalogue values minor",
    kind: "numberList",
  },
  { id: "queryKey", label: "Query key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerEditionCurrencyQualifiedKeys, "catalogue keys");
  aligned(
    input.callerEditionCurrencyQualifiedKeys,
    input.callerCatalogueValuesMinor,
    "entries",
  );
  input.callerCatalogueValuesMinor.forEach((v) => money(v, "catalogue value"));
  const k = input.callerEditionCurrencyQualifiedKeys.indexOf(input.queryKey);
  if (k < 0)
    simpleError("key", "Unknown caller catalogue number/edition/currency.");
  return { catalogueValueMinor: input.callerCatalogueValuesMinor[k] };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEditionCurrencyQualifiedKeys: ["edition-a/USD/1", "edition-a/USD/2"],
  callerCatalogueValuesMinor: [1000, 2000],
  queryKey: "edition-a/USD/2",
} satisfies Input;
export const exampleOutput = { catalogueValueMinor: 2000 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/catalogue-base-value-lookup",
  title: "Catalogue Value Base Lookup by Number Entry",
  description:
    "Look up a value from explicit caller catalogue edition/currency-qualified entries, not live market data. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
  inputs: inputFields,
  outputs: [
    {
      id: "catalogueValueMinor",
      label: "Catalogue value minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEditionCurrencyQualifiedKeys:
        value.callerEditionCurrencyQualifiedKeys as readonly string[],
      callerCatalogueValuesMinor:
        value.callerCatalogueValuesMinor as readonly number[],
      queryKey: value.queryKey as string,
    }),
});
export const run = tool.execute;
export default tool;
