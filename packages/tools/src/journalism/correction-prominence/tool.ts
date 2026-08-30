import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly originalAudience: number;
  readonly correctionAudience: number;
  readonly minimumReachPercent: number;
  readonly originalPlacementLevel: number;
  readonly correctionPlacementLevel: number;
}>;
export type Output = Readonly<{
  readonly correctionReachPercent: number;
  readonly placementDifference: number;
  readonly prominenceSufficient: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.originalAudience <= 0)
    simpleError(
      "originalAudience",
      "Original audience must be positive.",
      "invalid_audience",
    );
  const correctionReachPercent =
    (input.correctionAudience / input.originalAudience) * 100;
  const placementDifference =
    input.correctionPlacementLevel - input.originalPlacementLevel;
  return {
    correctionReachPercent,
    placementDifference,
    prominenceSufficient:
      correctionReachPercent >= input.minimumReachPercent &&
      placementDifference <= 0,
  };
};

export const exampleInput = {
  originalAudience: 1000,
  correctionAudience: 800,
  minimumReachPercent: 75,
  originalPlacementLevel: 2,
  correctionPlacementLevel: 1,
} satisfies Input;
export const exampleOutput = {
  correctionReachPercent: 80,
  placementDifference: -1,
  prominenceSufficient: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      originalAudience: input.originalAudience as number,
      correctionAudience: input.correctionAudience as number,
      minimumReachPercent: input.minimumReachPercent as number,
      originalPlacementLevel: input.originalPlacementLevel as number,
      correctionPlacementLevel: input.correctionPlacementLevel as number,
    }),
  description:
    "Compare correction reach and placement with supplied prominence requirements.",
  id: "journalism/correction-prominence",
  inputs: [
    {
      id: "originalAudience",
      label: "Original content audience",
      kind: "number",
      minimum: 0,
    },
    {
      id: "correctionAudience",
      label: "Correction audience",
      kind: "number",
      minimum: 0,
    },
    {
      id: "minimumReachPercent",
      label: "Minimum correction reach",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "originalPlacementLevel",
      label: "Original placement prominence",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "correctionPlacementLevel",
      label: "Correction placement prominence",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "correctionReachPercent",
      label: "Correction reach",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "placementDifference",
      label: "Correction minus original placement level",
      kind: "integer",
    },
    {
      id: "prominenceSufficient",
      label: "Meets supplied reach and placement rules",
      kind: "boolean",
    },
  ],
  title: "Correction Prominence",
});

export const run = tool.execute;
export default tool;
