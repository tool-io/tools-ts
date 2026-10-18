import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedPostLtpResponse: number;
  readonly actualQualifiedBaselineResponse: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualQualifiedPostLtpResponse",
    label: "Actual qualified post ltp response",
    kind: "number",
  },
  {
    id: "actualQualifiedBaselineResponse",
    label: "Actual qualified baseline response",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(
    input.actualQualifiedPostLtpResponse,
    "actualQualifiedPostLtpResponse",
  );
  positive(
    input.actualQualifiedBaselineResponse,
    "actualQualifiedBaselineResponse",
  );
  return {
    value:
      100 *
      (input.actualQualifiedPostLtpResponse /
        input.actualQualifiedBaselineResponse -
        1),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedPostLtpResponse: 3,
    actualQualifiedBaselineResponse: 2,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/ltp-magnitude",
  title: "LTP Magnitude Calculator",
  description:
    "Actual signed LTP percentage increase of matched qualified post/baseline response, not assume potentiation mechanism or automatically assign LTP. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
