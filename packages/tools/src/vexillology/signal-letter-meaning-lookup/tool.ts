import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch51-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    text: pick(
      input.topic,
      {
        A: "I have a diver down; keep well clear at slow speed.",
        B: "I am taking in, discharging, or carrying dangerous goods.",
        C: "Yes (affirmative).",
        D: "Keep clear of me; I am maneuvering with difficulty.",
        E: "I am altering my course to starboard.",
        F: "I am disabled; communicate with me.",
        G: "I require a pilot.",
        H: "I have a pilot on board.",
        I: "I am altering my course to port.",
        J: "I am on fire and have dangerous cargo; keep well clear.",
        K: "I wish to communicate with you.",
        L: "You should stop your vessel instantly.",
        M: "My vessel is stopped and making no way through the water.",
        N: "No (negative).",
        O: "Man overboard.",
        P: "In harbor: all persons should report on board; the vessel is about to proceed to sea.",
        Q: "My vessel is healthy and I request free pratique.",
        R: "No assigned standalone International Code of Signals message in this bounded inventory.",
        S: "I am operating astern propulsion.",
        T: "Keep clear of me; I am engaged in pair trawling.",
        U: "You are running into danger.",
        V: "I require assistance.",
        W: "I require medical assistance.",
        X: "Stop carrying out your intentions and watch for my signals.",
        Y: "I am dragging my anchor.",
        Z: "I require a tug.",
      },
      "topic",
    ),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { topic: "A" },
  output: {
    result: { text: "I have a diver down; keep well clear at slow speed." },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/signal-letter-meaning-lookup",
  title: "Signal Flag Letter to Meaning Lookup",
  description:
    "Bounded offline reference: BoundedcommonICSsinglelettermessages,qualifiedvariants(sound/fishing/port/naval/medical)not exhausted;actualcodebook/ruleedition external,no commandor navigationclearance. Only explicit listed topics;not exhaustive/live data or diagnosis,safety/compliance/identity certificate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
