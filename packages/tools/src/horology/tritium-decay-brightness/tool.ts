import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyMeasuredInitialTritiumBrightness: number;
  readonly actualElapsedYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyMeasuredInitialTritiumBrightness",
    label: "Actual independently measured initial tritium brightness",
    kind: "number",
  },
  { id: "actualElapsedYears", label: "Actual elapsed years", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyMeasuredInitialTritiumBrightness,
    "actualIndependentlyMeasuredInitialTritiumBrightness",
  );
  nonnegative(input.actualElapsedYears, "actualElapsedYears");
  return {
    value:
      input.actualIndependentlyMeasuredInitialTritiumBrightness *
      2 ** (-input.actualElapsedYears / 12.32),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIndependentlyMeasuredInitialTritiumBrightness: 1,
    actualElapsedYears: 12.32,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horology/tritium-decay-brightness",
  title: "Tritium Vial Brightness Decay Calculator",
  description:
    "Ideal tritium12.32yearradiodecayrelativebrightness withunchangedphosphorefficiency,not actualphotometricoutput/handling safety. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
