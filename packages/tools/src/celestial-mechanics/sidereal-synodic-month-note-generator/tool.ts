import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch52-shared.js";
export type Input = Readonly<{ readonly month: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "month", label: "Month", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  return {
    reference: pick(
      i.month,
      {
        sidereal: "Approximately 27.32 days relative to distant stars.",
        synodic: "Approximately 29.53 days between repeated lunar phases.",
      },
      "month",
    ),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { month: "sidereal" },
  output: {
    result: {
      reference: "Approximately 27.32 days relative to distant stars.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "celestial-mechanics/sidereal-synodic-month-note-generator",
  title: "Sidereal versus Synodic Month 27.32 vs 29.53 Day Note Generator",
  description:
    "Rounded sidereal/synodic lunar month distinction, not a date-specific ephemeris.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
