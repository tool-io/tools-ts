import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly expectedProductBp: number;
  readonly observedProductBp: number;
  readonly sizeToleranceBp: number;
}>;
export type Output = Readonly<{
  readonly sizeDifferenceBp: number;
  readonly absoluteDifferenceBp: number;
  readonly validProductSize: boolean;
}>;

export const calculate = (input: Input): Output => {
  const sizeDifferenceBp = input.observedProductBp - input.expectedProductBp;
  return {
    sizeDifferenceBp,
    absoluteDifferenceBp: Math.abs(sizeDifferenceBp),
    validProductSize: Math.abs(sizeDifferenceBp) <= input.sizeToleranceBp,
  };
};

export const exampleInput = {
  expectedProductBp: 150,
  observedProductBp: 153,
  sizeToleranceBp: 5,
} satisfies Input;
export const exampleOutput = {
  sizeDifferenceBp: 3,
  absoluteDifferenceBp: 3,
  validProductSize: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      expectedProductBp: input.expectedProductBp as number,
      observedProductBp: input.observedProductBp as number,
      sizeToleranceBp: input.sizeToleranceBp as number,
    }),
  description:
    "Validate an MSP product size against an expected amplicon and tolerance.",
  id: "epigenetics/msp-product-size",
  inputs: [
    {
      id: "expectedProductBp",
      label: "Expected MSP product size",
      kind: "integer",
      minimum: 0,
      unit: "bp",
    },
    {
      id: "observedProductBp",
      label: "Observed MSP product size",
      kind: "integer",
      minimum: 0,
      unit: "bp",
    },
    {
      id: "sizeToleranceBp",
      label: "Allowed size tolerance",
      kind: "integer",
      minimum: 0,
      unit: "bp",
    },
  ],
  outputs: [
    {
      id: "sizeDifferenceBp",
      label: "Observed minus expected size",
      kind: "integer",
      unit: "bp",
    },
    {
      id: "absoluteDifferenceBp",
      label: "Absolute size difference",
      kind: "integer",
      minimum: 0,
      unit: "bp",
    },
    {
      id: "validProductSize",
      label: "Within supplied size tolerance",
      kind: "boolean",
    },
  ],
  title: "MSP Product Size",
});

export const run = tool.execute;
export default tool;
