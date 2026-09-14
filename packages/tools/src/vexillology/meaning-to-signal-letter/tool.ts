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
        "I have a diver down; keep well clear at slow speed.": "A",
        "I am taking in, discharging, or carrying dangerous goods.": "B",
        "Yes (affirmative).": "C",
        "Keep clear of me; I am maneuvering with difficulty.": "D",
        "I am altering my course to starboard.": "E",
        "I am disabled; communicate with me.": "F",
        "I require a pilot.": "G",
        "I have a pilot on board.": "H",
        "I am altering my course to port.": "I",
        "I am on fire and have dangerous cargo; keep well clear.": "J",
        "I wish to communicate with you.": "K",
        "You should stop your vessel instantly.": "L",
        "My vessel is stopped and making no way through the water.": "M",
        "No (negative).": "N",
        "Man overboard.": "O",
        "In harbor: all persons should report on board; the vessel is about to proceed to sea.":
          "P",
        "My vessel is healthy and I request free pratique.": "Q",
        "No assigned standalone International Code of Signals message in this bounded inventory.":
          "R",
        "I am operating astern propulsion.": "S",
        "Keep clear of me; I am engaged in pair trawling.": "T",
        "You are running into danger.": "U",
        "I require assistance.": "V",
        "I require medical assistance.": "W",
        "Stop carrying out your intentions and watch for my signals.": "X",
        "I am dragging my anchor.": "Y",
        "I require a tug.": "Z",
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
  input: { topic: "I have a diver down; keep well clear at slow speed." },
  output: { result: { text: "A" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/meaning-to-signal-letter",
  title: "Meaning to Signal Flag Letter Reverse Lookup",
  description:
    "Bounded offline reference: ExactliteralreverseofboundedstandaloneICSmessageinventory,no natural-languageintentparser or multisignal interpretation. Only explicit listed topics;not exhaustive/live data or diagnosis,safety/compliance/identity certificate.",
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
