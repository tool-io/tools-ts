import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly tangentialWaistMicrometers: number;
  readonly sagittalWaistMicrometers: number;
}>;
export type Output = Readonly<{
  readonly waistRatio: number;
  readonly astigmatismPercent: number;
}>;

export const calculate = (input: Input): Output => {
  const smaller = Math.min(
    input.tangentialWaistMicrometers,
    input.sagittalWaistMicrometers,
  );
  const larger = Math.max(
    input.tangentialWaistMicrometers,
    input.sagittalWaistMicrometers,
  );
  if (smaller <= 0)
    simpleError(
      "tangentialWaistMicrometers",
      "Both waists must be positive.",
      "invalid_waist",
    );
  return {
    waistRatio: larger / smaller,
    astigmatismPercent: ((larger - smaller) / smaller) * 100,
  };
};

export const exampleInput = {
  tangentialWaistMicrometers: 100,
  sagittalWaistMicrometers: 80,
} satisfies Input;
export const exampleOutput = {
  waistRatio: 1.25,
  astigmatismPercent: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      tangentialWaistMicrometers: input.tangentialWaistMicrometers as number,
      sagittalWaistMicrometers: input.sagittalWaistMicrometers as number,
    }),
  description:
    "Quantify tangential/sagittal waist mismatch in a folded cavity.",
  id: "laser/folded-cavity-astigmatism",
  inputs: [
    {
      id: "tangentialWaistMicrometers",
      label: "Tangential waist",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    {
      id: "sagittalWaistMicrometers",
      label: "Sagittal waist",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
  ],
  outputs: [
    {
      id: "waistRatio",
      label: "Larger-to-smaller waist ratio",
      kind: "number",
      minimum: 1,
    },
    {
      id: "astigmatismPercent",
      label: "Waist mismatch",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Folded-Cavity Astigmatism",
});

export const run = tool.execute;
export default tool;
