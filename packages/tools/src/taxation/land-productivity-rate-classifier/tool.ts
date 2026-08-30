import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly annualProductiveOutput: number;
  readonly landArea: number;
  readonly productiveThresholdPerArea: number;
}>;
export type Output = Readonly<{
  readonly outputPerArea: number;
  readonly meetsProductiveThreshold: boolean;
  readonly classification: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.landArea <= 0)
    simpleError("landArea", "Land area must be positive.", "invalid_area");
  const outputPerArea = input.annualProductiveOutput / input.landArea;
  const meetsProductiveThreshold =
    outputPerArea >= input.productiveThresholdPerArea;
  return {
    outputPerArea,
    meetsProductiveThreshold,
    classification: meetsProductiveThreshold ? "productive" : "nonproductive",
  };
};

export const exampleInput = {
  annualProductiveOutput: 40000,
  landArea: 20,
  productiveThresholdPerArea: 1500,
} satisfies Input;
export const exampleOutput = {
  outputPerArea: 2000,
  meetsProductiveThreshold: true,
  classification: "productive",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      annualProductiveOutput: input.annualProductiveOutput as number,
      landArea: input.landArea as number,
      productiveThresholdPerArea: input.productiveThresholdPerArea as number,
    }),
  description:
    "Classify land productivity using caller-supplied output, area, and rate threshold.",
  id: "taxation/land-productivity-rate-classifier",
  inputs: [
    {
      id: "annualProductiveOutput",
      label: "Annual productive output",
      kind: "number",
      minimum: 0,
      unit: "currency/year",
    },
    {
      id: "landArea",
      label: "Land area",
      kind: "number",
      minimum: 0,
      unit: "area",
    },
    {
      id: "productiveThresholdPerArea",
      label: "Productive threshold per area",
      kind: "number",
      minimum: 0,
      unit: "currency/area",
    },
  ],
  outputs: [
    {
      id: "outputPerArea",
      label: "Output per area",
      kind: "number",
      minimum: 0,
      unit: "currency/area",
    },
    {
      id: "meetsProductiveThreshold",
      label: "Meets productive threshold",
      kind: "boolean",
    },
    {
      id: "classification",
      label: "Caller-threshold classification",
      kind: "string",
      enum: ["productive", "nonproductive"],
    },
  ],
  title: "Land Productivity Rate Classifier",
});

export const run = tool.execute;
export default tool;
