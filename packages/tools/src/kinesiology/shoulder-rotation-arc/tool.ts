import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly externalRotationDegrees: number;
  readonly internalRotationDegrees: number;
  readonly minimumArcDegrees: number;
}>;
export type Output = Readonly<{
  readonly totalArcDegrees: number;
  readonly shortfallDegrees: number;
  readonly meetsTarget: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.externalRotationDegrees < 0 ||
    input.internalRotationDegrees < 0 ||
    input.minimumArcDegrees < 0
  )
    simpleError(
      "externalRotationDegrees",
      "Nonnegative joint rotation angles and target required.",
    );
  const totalArcDegrees =
    input.externalRotationDegrees + input.internalRotationDegrees;
  return {
    totalArcDegrees,
    shortfallDegrees: Math.max(0, input.minimumArcDegrees - totalArcDegrees),
    meetsTarget: totalArcDegrees >= input.minimumArcDegrees,
  };
};
export const exampleInput = {
  externalRotationDegrees: 90,
  internalRotationDegrees: 70,
  minimumArcDegrees: 170,
} satisfies Input;
export const exampleOutput = {
  totalArcDegrees: 160,
  shortfallDegrees: 10,
  meetsTarget: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/shoulder-rotation-arc",
  title: "Shoulder Rotation Arc",
  description:
    "Sum shoulder internal/external rotation arc and compare with a caller target.",
  inputs: [
    {
      id: "externalRotationDegrees",
      label: "External rotation degrees",
      kind: "number",
    },
    {
      id: "internalRotationDegrees",
      label: "Internal rotation degrees",
      kind: "number",
    },
    { id: "minimumArcDegrees", label: "Minimum arc degrees", kind: "number" },
  ],
  outputs: [
    { id: "totalArcDegrees", label: "Total arc degrees", kind: "number" },
    { id: "shortfallDegrees", label: "Shortfall degrees", kind: "number" },
    { id: "meetsTarget", label: "Meets target", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      externalRotationDegrees: value.externalRotationDegrees as number,
      internalRotationDegrees: value.internalRotationDegrees as number,
      minimumArcDegrees: value.minimumArcDegrees as number,
    }),
});
export const run = tool.execute;
export default tool;
