import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualSurveyedBlockHectares: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualSurveyedBlockHectares",
    label: "Actual surveyed block hectares",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.actualSurveyedBlockHectares, "actualSurveyedBlockHectares");
  return { value: input.actualSurveyedBlockHectares * 2.471053814671653 };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { actualSurveyedBlockHectares: 1 },
  output: { result: { value: 2.471053814671653 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/vineyard-block-area-conversion",
  title: "Vineyard Block Area Conversion Calculator",
  description:
    "Actualvineyardha\u2192internationalacreconversion,scope/blockboundariesexternal;not geodesydelineation or vineplantingarea.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
