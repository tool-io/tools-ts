import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly likelihoodPercent: number;
  readonly maximumPotentialMisstatement: number;
  readonly materiality: number;
  readonly controlFailureSystemic: boolean;
}>;
export type Output = Readonly<{
  readonly expectedMisstatement: number;
  readonly materialityRatio: number;
  readonly severity: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.materiality <= 0)
    simpleError(
      "materiality",
      "Materiality must be positive.",
      "invalid_materiality",
    );
  const expectedMisstatement =
      (input.maximumPotentialMisstatement * input.likelihoodPercent) / 100,
    materialityRatio = input.maximumPotentialMisstatement / input.materiality;
  return {
    expectedMisstatement,
    materialityRatio,
    severity:
      input.controlFailureSystemic && materialityRatio >= 1
        ? "material-weakness"
        : materialityRatio >= 0.5 || input.likelihoodPercent >= 50
          ? "significant-deficiency"
          : "deficiency",
  };
};

export const exampleInput = {
  likelihoodPercent: 60,
  maximumPotentialMisstatement: 600,
  materiality: 1000,
  controlFailureSystemic: false,
} satisfies Input;
export const exampleOutput = {
  expectedMisstatement: 360,
  materialityRatio: 0.6,
  severity: "significant-deficiency",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      likelihoodPercent: input.likelihoodPercent as number,
      maximumPotentialMisstatement:
        input.maximumPotentialMisstatement as number,
      materiality: input.materiality as number,
      controlFailureSystemic: input.controlFailureSystemic as boolean,
    }),
  description:
    "Classify control-deficiency severity from likelihood and potential magnitude.",
  id: "auditing/deficiency-severity",
  inputs: [
    {
      id: "likelihoodPercent",
      label: "Misstatement likelihood",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "maximumPotentialMisstatement",
      label: "Maximum potential misstatement",
      kind: "number",
      minimum: 0,
    },
    { id: "materiality", label: "Materiality", kind: "number", minimum: 0 },
    {
      id: "controlFailureSystemic",
      label: "Control failure is systemic",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "expectedMisstatement",
      label: "Probability-weighted misstatement",
      kind: "number",
      minimum: 0,
    },
    {
      id: "materialityRatio",
      label: "Potential misstatement to materiality",
      kind: "number",
      minimum: 0,
    },
    {
      id: "severity",
      label: "Deficiency severity",
      kind: "string",
      enum: ["deficiency", "significant-deficiency", "material-weakness"],
    },
  ],
  title: "Deficiency Severity",
});

export const run = tool.execute;
export default tool;
