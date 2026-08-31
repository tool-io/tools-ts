import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, choose } from "../batch-shared.js";
export type Input = Readonly<{
  readonly baseVerbTokens: readonly string[];
  readonly callerBePastAgreement: string;
}>;
export type Output = Readonly<{
  readonly pastTenseTokensOrUnchangedUnknowns: readonly string[];
  readonly supportedIrregularFlags: readonly number[];
}>;
const inputFields = [
  { id: "baseVerbTokens", label: "Base verb tokens", kind: "stringList" },
  {
    id: "callerBePastAgreement",
    label: "Caller be past agreement",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.baseVerbTokens.length ||
    input.baseVerbTokens.some((s) => !/^[a-z]{1,64}$(?![\s\S])/.test(s)) ||
    !["singular", "plural"].includes(input.callerBePastAgreement)
  )
    simpleError(
      "verbs",
      "Bounded lowercase base verbs and explicit be-past agreement required.",
    );
  const table: Record<string, string> = {
    be: input.callerBePastAgreement === "singular" ? "was" : "were",
    go: "went",
    eat: "ate",
    see: "saw",
    take: "took",
    give: "gave",
    write: "wrote",
    speak: "spoke",
    come: "came",
    run: "ran",
    buy: "bought",
    bring: "brought",
    think: "thought",
    teach: "taught",
    catch: "caught",
    find: "found",
    get: "got",
    have: "had",
    do: "did",
    make: "made",
    know: "knew",
    leave: "left",
    feel: "felt",
    keep: "kept",
    sleep: "slept",
    meet: "met",
    say: "said",
    tell: "told",
    read: "read",
    put: "put",
    cut: "cut",
    hit: "hit",
    break: "broke",
    choose: "chose",
    drink: "drank",
    drive: "drove",
    fall: "fell",
    fly: "flew",
    forget: "forgot",
    grow: "grew",
    hold: "held",
    lose: "lost",
    pay: "paid",
    sell: "sold",
    send: "sent",
    sit: "sat",
    stand: "stood",
    swim: "swam",
    win: "won",
    wear: "wore",
  };
  return {
    pastTenseTokensOrUnchangedUnknowns: input.baseVerbTokens.map((s) =>
      Object.hasOwn(table, s) ? table[s] : s,
    ),
    supportedIrregularFlags: input.baseVerbTokens.map((s) =>
      Object.hasOwn(table, s) ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  baseVerbTokens: ["go", "eat", "be"],
  callerBePastAgreement: "singular",
} satisfies Input;
export const exampleOutput = {
  pastTenseTokensOrUnchangedUnknowns: ["went", "ate", "was"],
  supportedIrregularFlags: [1, 1, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/irregular-past-tense-top-english-lookup",
  title: "Top Irregular English Past Tenses Lookup",
  description:
    "Resolve bounded supported common English irregular past spellings with explicit was/were agreement and unchanged unknowns flagged; unlike existing regular-past tool, no guessed regularization, past participles or pronunciation of read.",
  inputs: inputFields,
  outputs: [
    {
      id: "pastTenseTokensOrUnchangedUnknowns",
      label: "Past tense tokens or unchanged unknowns",
      kind: "stringList",
    },
    {
      id: "supportedIrregularFlags",
      label: "Supported irregular flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      baseVerbTokens: value.baseVerbTokens as readonly string[],
      callerBePastAgreement: value.callerBePastAgreement as string,
    }),
});
export const run = tool.execute;
export default tool;
