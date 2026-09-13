import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualSourceRoomLevelDb: number;
  readonly actualReceivingRoomLevelDb: number;
  readonly actualPartitionArea: number;
  readonly callerActualReceivingEquivalentAbsorptionArea: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSourceRoomLevelDb",
    label: "Actual source room level db",
    kind: "number",
  },
  {
    id: "actualReceivingRoomLevelDb",
    label: "Actual receiving room level db",
    kind: "number",
  },
  { id: "actualPartitionArea", label: "Actual partition area", kind: "number" },
  {
    id: "callerActualReceivingEquivalentAbsorptionArea",
    label: "Caller actual receiving equivalent absorption area",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualPartitionArea, "actualPartitionArea");
  positive(
    input.callerActualReceivingEquivalentAbsorptionArea,
    "callerActualReceivingEquivalentAbsorptionArea",
  );
  return {
    value:
      input.actualSourceRoomLevelDb -
      input.actualReceivingRoomLevelDb +
      10 *
        Math.log10(
          input.actualPartitionArea /
            input.callerActualReceivingEquivalentAbsorptionArea,
        ),
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
    actualSourceRoomLevelDb: 60,
    actualReceivingRoomLevelDb: 50,
    actualPartitionArea: 1,
    callerActualReceivingEquivalentAbsorptionArea: 1,
  },
  output: { result: { value: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/apparent-sound-reduction-index",
  title: "Apparent Sound Reduction Index Calculator",
  description:
    "ActualapparentreductionindexR\u2032=L1\u2212L2+10log10(S/A),matchedband;flankingincludedinactualmeasurement,no isolatingtruepartitionR. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
