import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly protectedGroupSelected: number;
  readonly protectedGroupTotal: number;
  readonly referenceGroupSelected: number;
  readonly referenceGroupTotal: number;
  readonly minimumRateRatio: number;
}>;
export type Output = Readonly<{
  readonly protectedSelectionRate: number;
  readonly referenceSelectionRate: number;
  readonly rateRatio: number;
  readonly belowThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.protectedGroupTotal <= 0 ||
    input.referenceGroupTotal <= 0 ||
    input.protectedGroupSelected > input.protectedGroupTotal ||
    input.referenceGroupSelected > input.referenceGroupTotal
  )
    simpleError(
      "protectedGroupTotal",
      "Group totals must be positive and at least selections.",
      "invalid_groups",
    );
  const protectedSelectionRate =
      input.protectedGroupSelected / input.protectedGroupTotal,
    referenceSelectionRate =
      input.referenceGroupSelected / input.referenceGroupTotal;
  if (referenceSelectionRate === 0)
    simpleError(
      "referenceGroupSelected",
      "Reference selection rate must be positive.",
      "zero_reference_rate",
    );
  const rateRatio = protectedSelectionRate / referenceSelectionRate;
  return {
    protectedSelectionRate,
    referenceSelectionRate,
    rateRatio,
    belowThreshold: rateRatio < input.minimumRateRatio,
  };
};

export const exampleInput = {
  protectedGroupSelected: 40,
  protectedGroupTotal: 100,
  referenceGroupSelected: 50,
  referenceGroupTotal: 100,
  minimumRateRatio: 0.8,
} satisfies Input;
export const exampleOutput = {
  protectedSelectionRate: 0.4,
  referenceSelectionRate: 0.5,
  rateRatio: 0.8,
  belowThreshold: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      protectedGroupSelected: input.protectedGroupSelected as number,
      protectedGroupTotal: input.protectedGroupTotal as number,
      referenceGroupSelected: input.referenceGroupSelected as number,
      referenceGroupTotal: input.referenceGroupTotal as number,
      minimumRateRatio: input.minimumRateRatio as number,
    }),
  description:
    "Calculate selection-rate disparity against a caller-supplied ratio threshold.",
  id: "auditing/disparate-impact",
  inputs: [
    {
      id: "protectedGroupSelected",
      label: "Protected-group selections",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "protectedGroupTotal",
      label: "Protected-group population",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "referenceGroupSelected",
      label: "Reference-group selections",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "referenceGroupTotal",
      label: "Reference-group population",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "minimumRateRatio",
      label: "Minimum acceptable rate ratio",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "protectedSelectionRate",
      label: "Protected-group selection rate",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "referenceSelectionRate",
      label: "Reference-group selection rate",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "rateRatio",
      label: "Selection-rate ratio",
      kind: "number",
      minimum: 0,
    },
    {
      id: "belowThreshold",
      label: "Below supplied ratio threshold",
      kind: "boolean",
    },
  ],
  title: "Disparate Impact",
});

export const run = tool.execute;
export default tool;
