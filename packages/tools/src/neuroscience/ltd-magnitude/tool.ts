import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedPostLtdResponse: number;
  readonly actualQualifiedBaselineResponse: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedPostLtdResponse",
    label: "Actual qualified post ltd response",
    kind: "number",
  },
  {
    id: "actualQualifiedBaselineResponse",
    label: "Actual qualified baseline response",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualQualifiedPostLtdResponse,
    "actualQualifiedPostLtdResponse",
  );
  positive(
    input.actualQualifiedBaselineResponse,
    "actualQualifiedBaselineResponse",
  );
  return {
    value:
      100 *
      (1 -
        input.actualQualifiedPostLtdResponse /
          input.actualQualifiedBaselineResponse),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedPostLtdResponse: 1,
    actualQualifiedBaselineResponse: 2,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/ltd-magnitude",
  title: "LTD Magnitude Calculator",
  description:
    "Actual LTDpercentageDECREASEpositivewhen post<baseline, negative enhancement retained. Qualified protocol independent, no automatically classify LTD. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
