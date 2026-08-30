import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly coreDiameterMicrometers: number;
  readonly innerCladdingDiameterMicrometers: number;
}>;
export type Output = Readonly<{
  readonly claddingToCoreAreaRatio: number;
  readonly coreAreaFractionPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.coreDiameterMicrometers <= 0 ||
    input.innerCladdingDiameterMicrometers <= 0
  )
    simpleError(
      "coreDiameterMicrometers",
      "Diameters must be positive.",
      "invalid_diameter",
    );
  const claddingToCoreAreaRatio =
    (input.innerCladdingDiameterMicrometers / input.coreDiameterMicrometers) **
    2;
  return {
    claddingToCoreAreaRatio,
    coreAreaFractionPercent: 100 / claddingToCoreAreaRatio,
  };
};

export const exampleInput = {
  coreDiameterMicrometers: 20,
  innerCladdingDiameterMicrometers: 200,
} satisfies Input;
export const exampleOutput = {
  claddingToCoreAreaRatio: 100,
  coreAreaFractionPercent: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      coreDiameterMicrometers: input.coreDiameterMicrometers as number,
      innerCladdingDiameterMicrometers:
        input.innerCladdingDiameterMicrometers as number,
    }),
  description:
    "Calculate circular inner-cladding to core area ratio and core area fraction.",
  id: "laser/double-clad-area-ratio",
  inputs: [
    {
      id: "coreDiameterMicrometers",
      label: "Core diameter",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
    {
      id: "innerCladdingDiameterMicrometers",
      label: "Inner-cladding diameter",
      kind: "number",
      minimum: 0,
      unit: "µm",
    },
  ],
  outputs: [
    {
      id: "claddingToCoreAreaRatio",
      label: "Cladding-to-core area ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "coreAreaFractionPercent",
      label: "Core area fraction",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  title: "Double-Clad Area Ratio",
});

export const run = tool.execute;
export default tool;
