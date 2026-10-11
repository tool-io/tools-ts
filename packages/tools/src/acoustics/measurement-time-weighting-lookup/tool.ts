import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pick } from "../batch51-shared.js";
export type Input = Readonly<{ readonly topic: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "topic", label: "Topic", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  return {
    text: pick(
      input.topic,
      {
        fast: "Nominal exponential sound-level FAST time constant125ms.",
        slow: "Nominal exponential sound-level SLOW time constant1s.",
        scope:
          "Timeweighting is not frequencyweighting,Leqintegrationduration or a guaranteeofinstrumentcompliance.",
      },
      "topic",
    ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { topic: "fast" },
  output: {
    result: {
      text: "Nominal exponential sound-level FAST time constant125ms.",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/measurement-time-weighting-lookup",
  title: "Measurement Time Weighting Lookup",
  description:
    "Bounded offline reference: NominalF/Ssoundmeter timeweightingreference. Only explicit listed topics;not exhaustive/live data or diagnosis,safety/compliance/identity certificate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
