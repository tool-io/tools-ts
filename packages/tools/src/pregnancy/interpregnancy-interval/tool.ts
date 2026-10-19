import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  daysBetween,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyEstablishedPreviousBirthDate: string;
  readonly independentlyEstablishedNextConceptionDate: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyEstablishedPreviousBirthDate",
    label: "Independently established previous birth date",
    kind: "string",
  },
  {
    id: "independentlyEstablishedNextConceptionDate",
    label: "Independently established next conception date",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  const d = daysBetween(
    input.independentlyEstablishedPreviousBirthDate,
    input.independentlyEstablishedNextConceptionDate,
  );
  nonnegative(d, "interval");
  return {
    observedBirthToConceptionDays: d,
    observedBirthToConceptionWeeks: d / 7,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyEstablishedPreviousBirthDate: "2025-01-01",
    independentlyEstablishedNextConceptionDate: "2026-01-01",
  },
  output: {
    result: {
      observedBirthToConceptionDays: 365,
      observedBirthToConceptionWeeks: 52.142857142857146,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/interpregnancy-interval",
  title: "Interpregnancy Interval Calculator",
  description:
    "Actual independently established birth-to-next-conception interval, not birth-to-birth interval, contraceptive protection, universal recommended spacing or fertility prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observedBirthToConceptionDays: { type: "number" },
          observedBirthToConceptionWeeks: { type: "number" },
        },
        required: [
          "observedBirthToConceptionDays",
          "observedBirthToConceptionWeeks",
        ],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
