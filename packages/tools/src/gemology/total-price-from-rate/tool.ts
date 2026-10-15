import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualStoneCarats: number;
  readonly callerIndependentMatchedQuoteMinorUnitsPerCarat: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "actualStoneCarats", label: "Actual stone carats", kind: "number" },
  {
    id: "callerIndependentMatchedQuoteMinorUnitsPerCarat",
    label: "Caller independent matched quote minor units per carat",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(input.actualStoneCarats, "actualStoneCarats");
  nonnegative(
    input.callerIndependentMatchedQuoteMinorUnitsPerCarat,
    "callerIndependentMatchedQuoteMinorUnitsPerCarat",
  );
  return {
    value:
      input.actualStoneCarats *
      input.callerIndependentMatchedQuoteMinorUnitsPerCarat,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualStoneCarats: 2,
    callerIndependentMatchedQuoteMinorUnitsPerCarat: 10,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/total-price-from-rate",
  title: "Total Stone Price from Rate Calculator",
  description:
    "Actualstonecarats\u00d7independentlyquotedmatchedminorunits/carat,taxes/cutgrades/markupnotinferred,fractionalcentspossible. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
