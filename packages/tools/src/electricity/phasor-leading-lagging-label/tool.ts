import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  currentPhaseDegrees: number;
  voltagePhaseDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "currentPhaseDegrees",
    label: "Current phase degrees",
    kind: "number",
    unit: "deg",
  },
  {
    id: "voltagePhaseDegrees",
    label: "Voltage phase degrees",
    kind: "number",
    unit: "deg",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.currentPhaseDegrees, -360, 360);
  H.bounded(i.voltagePhaseDegrees, -360, 360);
  const delta =
    H.mod(i.currentPhaseDegrees - i.voltagePhaseDegrees + 180, 360) - 180;
  return H.finish({
    relativePhaseDegrees: delta,
    label:
      delta === 0
        ? "in-phase"
        : Math.abs(delta) === 180
          ? "opposed"
          : delta > 0
            ? "current-leading"
            : "current-lagging",
  });
};
export const example = {
  input: { currentPhaseDegrees: 30, voltagePhaseDegrees: 0 },
  output: { result: { relativePhaseDegrees: 30, label: "current-leading" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/phasor-leading-lagging-label",
  title: "Electricity: Phasor Leading Lagging Label Tool",
  description:
    "Label current phase relative to voltage under a signed phasor convention normalized to [-180,180); not power-factor or instrument calibration.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          relativePhaseDegrees: { type: "number" },
        },
        required: ["label", "relativePhaseDegrees"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
