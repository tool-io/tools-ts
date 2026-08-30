import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly pillarWidthM: number;
  readonly pillarLengthM: number;
  readonly roomWidthAcrossM: number;
  readonly roomWidthAlongM: number;
  readonly secondaryPillarExtractionFraction: number;
}>;
export type Output = Readonly<{
  readonly primaryPlanExtractionFraction: number;
  readonly totalPlanExtractionFraction: number;
}>;
const inputFields = [
  { id: "pillarWidthM", label: "Pillar width m", kind: "number" },
  { id: "pillarLengthM", label: "Pillar length m", kind: "number" },
  { id: "roomWidthAcrossM", label: "Room width across m", kind: "number" },
  { id: "roomWidthAlongM", label: "Room width along m", kind: "number" },
  {
    id: "secondaryPillarExtractionFraction",
    label: "Secondary pillar extraction fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.pillarWidthM, "pillarWidthM");
  positive(input.pillarLengthM, "pillarLengthM");
  nonnegative(input.roomWidthAcrossM, "roomWidthAcrossM");
  nonnegative(input.roomWidthAlongM, "roomWidthAlongM");
  fraction(
    input.secondaryPillarExtractionFraction,
    "secondaryPillarExtractionFraction",
  );
  const left =
    (input.pillarWidthM * input.pillarLengthM) /
    ((input.pillarWidthM + input.roomWidthAcrossM) *
      (input.pillarLengthM + input.roomWidthAlongM));
  return {
    primaryPlanExtractionFraction: 1 - left,
    totalPlanExtractionFraction:
      1 - left * (1 - input.secondaryPillarExtractionFraction),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pillarWidthM: 10,
  pillarLengthM: 20,
  roomWidthAcrossM: 5,
  roomWidthAlongM: 10,
  secondaryPillarExtractionFraction: 0.25,
} satisfies Input;
export const exampleOutput = {
  primaryPlanExtractionFraction: 0.5555555555555556,
  totalPlanExtractionFraction: 0.6666666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/room-and-pillar-recovery",
  title: "Room and Pillar Recovery",
  description:
    "Estimate plan-area extraction for rectangular repeating cells and caller secondary pillar recovery; excludes seam losses and stability recommendations.",
  inputs: inputFields,
  outputs: [
    {
      id: "primaryPlanExtractionFraction",
      label: "Primary plan extraction fraction",
      kind: "number",
    },
    {
      id: "totalPlanExtractionFraction",
      label: "Total plan extraction fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pillarWidthM: value.pillarWidthM as number,
      pillarLengthM: value.pillarLengthM as number,
      roomWidthAcrossM: value.roomWidthAcrossM as number,
      roomWidthAlongM: value.roomWidthAlongM as number,
      secondaryPillarExtractionFraction:
        value.secondaryPillarExtractionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
