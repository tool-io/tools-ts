import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, roundRobin } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualPlayers: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualPlayers", label: "Actual players", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  return { rounds: roundRobin(input.actualPlayers) };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualPlayers: ["A", "B", "C", "D"] },
  output: {
    result: {
      rounds: [
        [
          ["A", "D"],
          ["B", "C"],
        ],
        [
          ["A", "C"],
          ["D", "B"],
        ],
        [
          ["A", "B"],
          ["C", "D"],
        ],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/round-robin-scheduler",
  title: "Round Robin Scheduler Fun",
  description:
    "Deterministiccirclemethodsingle-round-robinpairings,everypaironce,oddplayerbyeomitted,not venue/time scheduler. Boundedoffline arithmetic/sampling only;not gambling advice,fair physical randomness,secure randomness or predictive certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rounds: {
            type: "array",
            items: {
              type: "array",
              items: { type: "array", items: { type: "string" } },
            },
          },
        },
        required: ["rounds"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
