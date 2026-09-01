import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, strictTokens } from "../batch-shared.js";
export type Input = Readonly<{ readonly observedConstituentOrder: string }>;
export type Output = Readonly<{
  readonly canonicalWordOrderType: string;
  readonly subjectPosition: number;
  readonly verbPosition: number;
  readonly objectPosition: number;
}>;
const inputFields = [
  {
    id: "observedConstituentOrder",
    label: "Observed constituent order",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const order = strictTokens(input.observedConstituentOrder);
  if (
    order.length !== 3 ||
    new Set(order).size !== 3 ||
    order.some((v) => !["S", "V", "O"].includes(v))
  )
    simpleError(
      "order",
      "Exactly one each explicitly annotated S, V and O token required.",
    );
  return {
    canonicalWordOrderType: order.join(""),
    subjectPosition: order.indexOf("S"),
    verbPosition: order.indexOf("V"),
    objectPosition: order.indexOf("O"),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedConstituentOrder: "S O V",
} satisfies Input;
export const exampleOutput = {
  canonicalWordOrderType: "SOV",
  subjectPosition: 0,
  verbPosition: 2,
  objectPosition: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/word-order-typology-sov-svo-lookup",
  title: "Word Order Typology SOV/SVO/VSO Lookup",
  description:
    "Classify one caller explicitly annotated clause permutation, not a claim of dominant word order for a language or automatic syntax/subject detection.",
  inputs: inputFields,
  outputs: [
    {
      id: "canonicalWordOrderType",
      label: "Canonical word order type",
      kind: "string",
    },
    { id: "subjectPosition", label: "Subject position", kind: "number" },
    { id: "verbPosition", label: "Verb position", kind: "number" },
    { id: "objectPosition", label: "Object position", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedConstituentOrder: value.observedConstituentOrder as string,
    }),
});
export const run = tool.execute;
export default tool;
