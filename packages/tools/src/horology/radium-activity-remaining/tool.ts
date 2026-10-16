import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualVerifiedInitialRadium226ActivityBq: number;
  readonly actualElapsedYears: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualVerifiedInitialRadium226ActivityBq",
    label: "Actual verified initial radium226 activity bq",
    kind: "number",
  },
  { id: "actualElapsedYears", label: "Actual elapsed years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  nonnegative(
    input.actualVerifiedInitialRadium226ActivityBq,
    "actualVerifiedInitialRadium226ActivityBq",
  );
  nonnegative(input.actualElapsedYears, "actualElapsedYears");
  return {
    value:
      input.actualVerifiedInitialRadium226ActivityBq *
      2 ** (-input.actualElapsedYears / 1600),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualVerifiedInitialRadium226ActivityBq: 1,
    actualElapsedYears: 1600,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/radium-activity-remaining",
  title: "Radium Dial Activity Remaining Calculator",
  description:
    "IdealRa2261600yearhalf-life ACTIVITYnotbrightness,lume/phosphor/decaydaughterradiationexternal,no opening/handlinginstruction. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
