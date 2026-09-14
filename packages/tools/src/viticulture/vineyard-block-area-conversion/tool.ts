import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{ readonly actualSurveyedBlockHectares: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSurveyedBlockHectares",
    label: "Actual surveyed block hectares",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualSurveyedBlockHectares, "actualSurveyedBlockHectares");
  return { value: input.actualSurveyedBlockHectares * 2.471053814671653 };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
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
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
