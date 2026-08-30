import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly totalAdjustedCapital: number;
  readonly authorizedControlLevelCapital: number;
  readonly companyActionThresholdPercent: number;
  readonly regulatoryActionThresholdPercent: number;
}>;
export type Output = Readonly<{
  readonly rbcRatioPercent: number;
  readonly actionLevel: string;
  readonly companyThresholdMargin: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.authorizedControlLevelCapital <= 0)
    simpleError(
      "authorizedControlLevelCapital",
      "Authorized control-level capital must be positive.",
      "invalid_capital",
    );
  const rbcRatioPercent =
    (input.totalAdjustedCapital / input.authorizedControlLevelCapital) * 100;
  return {
    rbcRatioPercent,
    actionLevel:
      rbcRatioPercent < input.regulatoryActionThresholdPercent
        ? "regulatory-action"
        : rbcRatioPercent < input.companyActionThresholdPercent
          ? "company-action"
          : "adequate",
    companyThresholdMargin:
      rbcRatioPercent - input.companyActionThresholdPercent,
  };
};

export const exampleInput = {
  totalAdjustedCapital: 250,
  authorizedControlLevelCapital: 100,
  companyActionThresholdPercent: 200,
  regulatoryActionThresholdPercent: 150,
} satisfies Input;
export const exampleOutput = {
  rbcRatioPercent: 250,
  actionLevel: "adequate",
  companyThresholdMargin: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      totalAdjustedCapital: input.totalAdjustedCapital as number,
      authorizedControlLevelCapital:
        input.authorizedControlLevelCapital as number,
      companyActionThresholdPercent:
        input.companyActionThresholdPercent as number,
      regulatoryActionThresholdPercent:
        input.regulatoryActionThresholdPercent as number,
    }),
  description:
    "Compare an insurer RBC ratio with caller-supplied action thresholds.",
  id: "insurance/rbc-action-level",
  inputs: [
    {
      id: "totalAdjustedCapital",
      label: "Total adjusted capital",
      kind: "number",
      minimum: 0,
    },
    {
      id: "authorizedControlLevelCapital",
      label: "Authorized control-level capital",
      kind: "number",
      minimum: 0,
    },
    {
      id: "companyActionThresholdPercent",
      label: "Company action threshold",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "regulatoryActionThresholdPercent",
      label: "Regulatory action threshold",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "rbcRatioPercent",
      label: "RBC ratio",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "actionLevel",
      label: "Action level",
      kind: "string",
      enum: ["adequate", "company-action", "regulatory-action"],
    },
    {
      id: "companyThresholdMargin",
      label: "Margin over company threshold",
      kind: "number",
      unit: "percentage points",
    },
  ],
  title: "RBC Action Level",
});

export const run = tool.execute;
export default tool;
