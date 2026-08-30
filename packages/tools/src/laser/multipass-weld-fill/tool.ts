import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly seamLengthMillimeters: number;
  readonly jointAreaMm2: number;
  readonly wireDiameterMillimeters: number;
  readonly wireFeedLengthMillimeters: number;
  readonly depositionEfficiency: number;
  readonly passCount: number;
}>;
export type Output = Readonly<{
  readonly requiredFillVolumeMm3: number;
  readonly depositedVolumeMm3: number;
  readonly fillRatio: number;
  readonly volumePerPassMm3: number;
}>;

export const calculate = (input: Input): Output => {
  const requiredFillVolumeMm3 =
    input.seamLengthMillimeters * input.jointAreaMm2;
  if (requiredFillVolumeMm3 <= 0)
    simpleError(
      "jointAreaMm2",
      "Required joint volume must be positive.",
      "invalid_joint",
    );
  const depositedVolumeMm3 =
    Math.PI *
    (input.wireDiameterMillimeters / 2) ** 2 *
    input.wireFeedLengthMillimeters *
    input.depositionEfficiency;
  return {
    requiredFillVolumeMm3,
    depositedVolumeMm3,
    fillRatio: depositedVolumeMm3 / requiredFillVolumeMm3,
    volumePerPassMm3: depositedVolumeMm3 / input.passCount,
  };
};

export const exampleInput = {
  seamLengthMillimeters: 10,
  jointAreaMm2: 2,
  wireDiameterMillimeters: 2,
  wireFeedLengthMillimeters: 10,
  depositionEfficiency: 1,
  passCount: 2,
} satisfies Input;
export const exampleOutput = {
  requiredFillVolumeMm3: 20,
  depositedVolumeMm3: 31.41592653589793,
  fillRatio: 1.5707963267948966,
  volumePerPassMm3: 15.707963267948966,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      seamLengthMillimeters: input.seamLengthMillimeters as number,
      jointAreaMm2: input.jointAreaMm2 as number,
      wireDiameterMillimeters: input.wireDiameterMillimeters as number,
      wireFeedLengthMillimeters: input.wireFeedLengthMillimeters as number,
      depositionEfficiency: input.depositionEfficiency as number,
      passCount: input.passCount as number,
    }),
  description:
    "Compare multipass weld joint volume with deposited fill-wire volume.",
  id: "laser/multipass-weld-fill",
  inputs: [
    {
      id: "seamLengthMillimeters",
      label: "Seam length",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "jointAreaMm2",
      label: "Joint cross-sectional area",
      kind: "number",
      minimum: 0,
      unit: "mm²",
    },
    {
      id: "wireDiameterMillimeters",
      label: "Fill-wire diameter",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "wireFeedLengthMillimeters",
      label: "Total wire feed",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "depositionEfficiency",
      label: "Deposition efficiency",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    { id: "passCount", label: "Weld pass count", kind: "integer", minimum: 1 },
  ],
  outputs: [
    {
      id: "requiredFillVolumeMm3",
      label: "Required fill volume",
      kind: "number",
      minimum: 0,
      unit: "mm³",
    },
    {
      id: "depositedVolumeMm3",
      label: "Deposited wire volume",
      kind: "number",
      minimum: 0,
      unit: "mm³",
    },
    {
      id: "fillRatio",
      label: "Deposited-to-required fill ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "volumePerPassMm3",
      label: "Deposited volume per pass",
      kind: "number",
      minimum: 0,
      unit: "mm³",
    },
  ],
  title: "Multipass Weld Fill",
});

export const run = tool.execute;
export default tool;
