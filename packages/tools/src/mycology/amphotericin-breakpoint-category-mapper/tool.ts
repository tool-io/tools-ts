import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AmphoBreakpointMapperInput = {
  readonly micMgPerL: number;
  readonly resistantMinimumMgPerL: number;
  readonly susceptibleMaximumMgPerL: number;
};

export type AmphoBreakpointMapperOutput = {
  readonly breakpointCategory: "susceptible" | "intermediate" | "resistant";
  readonly criteriaSource: "caller-supplied";
};

export const amphoBreakpointMapperExample = {
  input: {
    micMgPerL: 1,
    resistantMinimumMgPerL: 4,
    susceptibleMaximumMgPerL: 1,
  },
  output: {
    breakpointCategory: "susceptible",
    criteriaSource: "caller-supplied",
  },
} satisfies ToolExample<
  AmphoBreakpointMapperInput,
  AmphoBreakpointMapperOutput
>;

export const calculateAmphoBreakpointMapper = (
  input: AmphoBreakpointMapperInput,
): AmphoBreakpointMapperOutput => {
  for (const key of [
    "micMgPerL",
    "resistantMinimumMgPerL",
    "susceptibleMaximumMgPerL",
  ] as const) {
    if (!Number.isFinite(input[key]) || input[key] < 0)
      return simpleError(
        key,
        "MIC values and caller-supplied thresholds must be finite and non-negative.",
        "invalid_mic",
      );
  }
  if (input.susceptibleMaximumMgPerL >= input.resistantMinimumMgPerL)
    return simpleError(
      "resistantMinimumMgPerL",
      "The resistant threshold must be greater than the susceptible threshold.",
      "invalid_breakpoints",
    );
  return {
    breakpointCategory:
      input.micMgPerL <= input.susceptibleMaximumMgPerL
        ? "susceptible"
        : input.micMgPerL >= input.resistantMinimumMgPerL
          ? "resistant"
          : "intermediate",
    criteriaSource: "caller-supplied",
  };
};

export const amphoBreakpointMapperTool = createSimpleTool({
  id: "mycology/amphotericin-breakpoint-category-mapper",
  title: "Amphotericin B Breakpoint Mapper",
  description:
    "Map an amphotericin B MIC to susceptible, intermediate, or resistant using explicitly supplied thresholds. No universal CLSI amphotericin B breakpoint is assumed; use criteria applicable to the organism, method, and current reporting standard.",
  inputs: [
    {
      id: "micMgPerL",
      kind: "number",
      label: "MIC",
      minimum: 0,
      unit: "mg/L",
    },
    {
      id: "susceptibleMaximumMgPerL",
      kind: "number",
      label: "Susceptible maximum",
      minimum: 0,
      unit: "mg/L",
    },
    {
      id: "resistantMinimumMgPerL",
      kind: "number",
      label: "Resistant minimum",
      minimum: Number.MIN_VALUE,
      unit: "mg/L",
    },
  ],
  outputs: [
    {
      enum: ["susceptible", "intermediate", "resistant"],
      id: "breakpointCategory",
      kind: "string",
      label: "Breakpoint category",
    },
    {
      enum: ["caller-supplied"],
      id: "criteriaSource",
      kind: "string",
      label: "Criteria source",
    },
  ],
  calculate: (input) =>
    calculateAmphoBreakpointMapper({
      micMgPerL: input.micMgPerL as number,
      resistantMinimumMgPerL: input.resistantMinimumMgPerL as number,
      susceptibleMaximumMgPerL: input.susceptibleMaximumMgPerL as number,
    }),
});
export const runAmphoBreakpointMapper = amphoBreakpointMapperTool.execute;
export default amphoBreakpointMapperTool;
