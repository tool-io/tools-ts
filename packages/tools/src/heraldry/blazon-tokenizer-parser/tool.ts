import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  tokenInventory,
} from "../batch43-shared.js";

export type Input = Readonly<{ readonly blazonText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "blazonText", label: "Blazon text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.blazonText.length > 8192)
    simpleError(
      "text",
      "At most 8192 UTF-16 units of restricted blazon input.",
    );
  const text = input.blazonText.trim().replace(/\.$/, ""),
    tokens = tokenInventory(text.replace(/,/g, " ")),
    clauses = text
      .toLowerCase()
      .split(",")
      .map((v) => v.trim()),
    tinctures = ["or", "argent", "gules", "azure", "sable", "vert", "purpure"],
    singular: Readonly<Record<string, string>> = {
      lion: "lion",
      lions: "lion",
      eagle: "eagle",
      eagles: "eagle",
      roundel: "roundel",
      roundels: "roundel",
      chief: "chief",
      fess: "fess",
      pale: "pale",
      bend: "bend",
      bordure: "bordure",
    },
    counts: Readonly<Record<string, number>> = {
      a: 1,
      an: 1,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
    };
  if (!tinctures.includes(clauses[0]) || clauses.length > 17)
    simpleError(
      "text",
      "One simple English field tincture then at most 16 comma-delimited charges.",
    );
  const chargeCounts: number[] = [],
    chargeNames: string[] = [],
    chargeTinctures: string[] = [];
  for (const clause of clauses.slice(1)) {
    const parts = clause.split(/\s+/u),
      [count, name, tincture] = parts;
    if (
      parts.length !== 3 ||
      !Object.hasOwn(counts, count) ||
      !Object.hasOwn(singular, name) ||
      !tinctures.includes(tincture)
    )
      simpleError(
        "charge",
        "Supported count, simple charge name and standard tincture only; unsupported blazons rejected, not partially parsed.",
      );
    const plural = ["lions", "eagles", "roundels"].includes(name);
    if (plural !== counts[count] > 1)
      simpleError(
        "charge",
        "Supported singular/plural charge count agreement required.",
      );
    chargeCounts.push(counts[count]);
    chargeNames.push(singular[name]);
    chargeTinctures.push(tincture);
  }
  return {
    tokens,
    firstToken: tokens[0],
    fieldTincture: clauses[0],
    chargeCounts,
    chargeNames,
    chargeTinctures,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { blazonText: "Or, a lion gules." },
  output: {
    result: {
      tokens: ["Or", "a", "lion", "gules"],
      firstToken: "Or",
      fieldTincture: "or",
      chargeCounts: [1],
      chargeNames: ["lion"],
      chargeTinctures: ["gules"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/blazon-tokenizer-parser",
  title: "Blazon Text Tokenizer to Structured Fields Parser",
  description:
    "Parse a restricted English blazon: one standard field tincture and up to 16 comma-delimited count/name/tincture charge clauses. Supports counts 1–6, lions/eagles/roundels and single chief/fess/pale/bend/bordure. Case-insensitive roles with original lexical tokens; rejects unsupported divisions, modifiers, arrangements, furs/proper and recursive syntax rather than silently returning a partial parse. Not a grant-legality decision.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
