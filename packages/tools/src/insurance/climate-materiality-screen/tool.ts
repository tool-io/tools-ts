import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly financialMaterialityScore: number;
  readonly impactMaterialityScore: number;
  readonly financialThreshold: number;
  readonly impactThreshold: number;
}>;
export type Output = Readonly<{
  readonly financiallyMaterial: boolean;
  readonly impactMaterial: boolean;
  readonly doubleMaterial: boolean;
  readonly screenResult: string;
}>;

export const calculate = (input: Input): Output => {
  const financiallyMaterial =
      input.financialMaterialityScore >= input.financialThreshold,
    impactMaterial = input.impactMaterialityScore >= input.impactThreshold;
  return {
    financiallyMaterial,
    impactMaterial,
    doubleMaterial: financiallyMaterial && impactMaterial,
    screenResult:
      financiallyMaterial && impactMaterial
        ? "double-material"
        : financiallyMaterial
          ? "financial-only"
          : impactMaterial
            ? "impact-only"
            : "neither",
  };
};

export const exampleInput = {
  financialMaterialityScore: 80,
  impactMaterialityScore: 70,
  financialThreshold: 60,
  impactThreshold: 60,
} satisfies Input;
export const exampleOutput = {
  financiallyMaterial: true,
  impactMaterial: true,
  doubleMaterial: true,
  screenResult: "double-material",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      financialMaterialityScore: input.financialMaterialityScore as number,
      impactMaterialityScore: input.impactMaterialityScore as number,
      financialThreshold: input.financialThreshold as number,
      impactThreshold: input.impactThreshold as number,
    }),
  description: "Screen climate exposure for financial and impact materiality.",
  id: "insurance/climate-materiality-screen",
  inputs: [
    {
      id: "financialMaterialityScore",
      label: "Financial materiality score",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
    {
      id: "impactMaterialityScore",
      label: "Impact materiality score",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
    {
      id: "financialThreshold",
      label: "Financial threshold",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
    {
      id: "impactThreshold",
      label: "Impact threshold",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "financiallyMaterial",
      label: "Financially material",
      kind: "boolean",
    },
    { id: "impactMaterial", label: "Impact material", kind: "boolean" },
    { id: "doubleMaterial", label: "Double material", kind: "boolean" },
    {
      id: "screenResult",
      label: "Screen result",
      kind: "string",
      enum: ["neither", "financial-only", "impact-only", "double-material"],
    },
  ],
  title: "Climate Materiality Screen",
});

export const run = tool.execute;
export default tool;
