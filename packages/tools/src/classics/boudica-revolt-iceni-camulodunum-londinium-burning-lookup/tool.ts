import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch45-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "topic",
    label: "Topic",
    kind: "string",
    enum: ["summary", "reference", "limitations"],
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        summary:
          "Boudica's revolt in 60/61 CE affected Camulodunum, Londinium and Verulamium, with literary accounts and destruction horizons.",
        reference: "Tacitus, Annals14; Cassius Dio 62; archaeology.",
        limitations:
          "Reported speeches, casualty totals and precise chronology are not independently verified in every detail.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { topic: "summary" },
  output: {
    result: {
      text: "Boudica's revolt in 60/61 CE affected Camulodunum, Londinium and Verulamium, with literary accounts and destruction horizons.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/boudica-revolt-iceni-camulodunum-londinium-burning-lookup",
  title: "Boudica Revolt Iceni Camulodunum Londinium Burning Lookup",
  description:
    "Bounded offline reference: Boudica's revolt in 60/61 CE affected Camulodunum, Londinium and Verulamium, with literary accounts and destruction horizons. Source: Tacitus, Annals14; Cassius Dio 62; archaeology. Reported speeches, casualty totals and precise chronology are not independently verified in every detail. Supported topic keys: summary, reference, limitations. No complete external corpus or live policy implied.",
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
