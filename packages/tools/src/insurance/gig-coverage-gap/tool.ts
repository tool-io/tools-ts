import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly personalPolicyEndMinute: number;
  readonly platformCoverageStartMinute: number;
  readonly tripEndMinute: number;
}>;
export type Output = Readonly<{
  readonly gapStartMinute: number;
  readonly gapEndMinute: number;
  readonly gapDurationMinutes: number;
  readonly coverageGap: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.tripEndMinute < input.personalPolicyEndMinute)
    simpleError(
      "tripEndMinute",
      "Trip end cannot precede personal coverage end.",
      "invalid_timeline",
    );
  const gapStartMinute = input.personalPolicyEndMinute,
    gapEndMinute = Math.min(
      input.platformCoverageStartMinute,
      input.tripEndMinute,
    ),
    gapDurationMinutes = Math.max(0, gapEndMinute - gapStartMinute);
  return {
    gapStartMinute,
    gapEndMinute,
    gapDurationMinutes,
    coverageGap: gapDurationMinutes > 0,
  };
};

export const exampleInput = {
  personalPolicyEndMinute: 0,
  platformCoverageStartMinute: 10,
  tripEndMinute: 30,
} satisfies Input;
export const exampleOutput = {
  gapStartMinute: 0,
  gapEndMinute: 10,
  gapDurationMinutes: 10,
  coverageGap: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      personalPolicyEndMinute: input.personalPolicyEndMinute as number,
      platformCoverageStartMinute: input.platformCoverageStartMinute as number,
      tripEndMinute: input.tripEndMinute as number,
    }),
  description:
    "Measure a gig-driver coverage gap between personal and platform policies.",
  id: "insurance/gig-coverage-gap",
  inputs: [
    {
      id: "personalPolicyEndMinute",
      label: "Personal coverage end",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
    {
      id: "platformCoverageStartMinute",
      label: "Platform coverage start",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
    {
      id: "tripEndMinute",
      label: "Trip end",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
  ],
  outputs: [
    {
      id: "gapStartMinute",
      label: "Coverage gap start",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
    {
      id: "gapEndMinute",
      label: "Coverage gap end",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
    {
      id: "gapDurationMinutes",
      label: "Coverage gap duration",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
    { id: "coverageGap", label: "Coverage gap exists", kind: "boolean" },
  ],
  title: "Gig Coverage Gap",
});

export const run = tool.execute;
export default tool;
