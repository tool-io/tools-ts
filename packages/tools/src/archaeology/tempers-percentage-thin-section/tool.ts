import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyIdentifiedTemperArea: number;
  readonly actualObservedThinSectionTotalArea: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyIdentifiedTemperArea",
    label: "Actual independently identified temper area",
    kind: "number",
  },
  {
    id: "actualObservedThinSectionTotalArea",
    label: "Actual observed thin section total area",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyIdentifiedTemperArea,
    "actualIndependentlyIdentifiedTemperArea",
  );
  positive(
    input.actualObservedThinSectionTotalArea,
    "actualObservedThinSectionTotalArea",
  );
  return {
    value:
      (100 * input.actualIndependentlyIdentifiedTemperArea) /
      input.actualObservedThinSectionTotalArea,
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
    actualIndependentlyIdentifiedTemperArea: 2,
    actualObservedThinSectionTotalArea: 10,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/tempers-percentage-thin-section",
  title: "Temper Percentage Thin Section Calculator",
  description:
    "Actualqualifiedthin-sectiontemperareafraction,not inferfabric/temperfromunclassifiedpixels. Actual independently established geometry,calibration,product/rubricedition,units and applicability;not provenance,identity,grade,safe procedure or operational/compliance approval.",
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
