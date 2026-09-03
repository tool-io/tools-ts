import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly talents: number;
  readonly callerMinaPerTalent: number;
  readonly callerDrachmaPerMina: number;
  readonly callerObolsPerDrachma: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "talents", label: "Talents", kind: "number" },
  {
    id: "callerMinaPerTalent",
    label: "Caller mina per talent",
    kind: "number",
  },
  {
    id: "callerDrachmaPerMina",
    label: "Caller drachma per mina",
    kind: "number",
  },
  {
    id: "callerObolsPerDrachma",
    label: "Caller obols per drachma",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerMinaPerTalent, "callerMinaPerTalent");
  positive(input.callerDrachmaPerMina, "callerDrachmaPerMina");
  positive(input.callerObolsPerDrachma, "callerObolsPerDrachma");
  nonnegative(input.talents, "talents");
  return {
    minae: input.talents * input.callerMinaPerTalent,
    drachmae:
      input.talents * input.callerMinaPerTalent * input.callerDrachmaPerMina,
    obols:
      input.talents *
      input.callerMinaPerTalent *
      input.callerDrachmaPerMina *
      input.callerObolsPerDrachma,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    talents: 1,
    callerMinaPerTalent: 60,
    callerDrachmaPerMina: 100,
    callerObolsPerDrachma: 6,
  },
  output: { result: { minae: 60, drachmae: 6000, obols: 36000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/greek-weight-stack-talent-mina-drachma-obol-lookup",
  title: "Greek Weight Stack Talent Mina Drachma Obol Lookup",
  description:
    "Caller independently verified talent/mina/drachma/obol system;60/100/6 example is a conventional Attic stack, not a universal regional mass or purchasing power.",
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
