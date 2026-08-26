import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TerminalDigitPreferenceShareInput = {
  readonly reportedAges: readonly number[];
  readonly terminalDigit: number;
};

export type TerminalDigitPreferenceShareOutput = {
  readonly countAtDigit: number;
  readonly totalReportedAges: number;
  readonly sharePercent: number;
  readonly deviationFromUniformPoints: number;
};

export const calculateTerminalDigitPreferenceShare = (
  input: TerminalDigitPreferenceShareInput,
): TerminalDigitPreferenceShareOutput => {
  if (input.reportedAges.length === 0)
    simpleError(
      "reportedAges",
      "Provide at least one reported age.",
      "invalid_list",
    );
  for (const value of input.reportedAges)
    if (!(typeof value === "number" && Number.isInteger(value) && value >= 0))
      simpleError(
        "reportedAges",
        "Reported ages must be non-negative integers.",
        "invalid_list",
      );
  if (!(
    Number.isSafeInteger(input.terminalDigit) &&
    input.terminalDigit >= 0 &&
    input.terminalDigit <= 9
  ))
    simpleError(
      "terminalDigit",
      "The terminal digit must be an integer from 0 to 9.",
      "invalid_digit",
    );
  let countAtDigit = 0;
  for (const age of input.reportedAges)
    if (age % 10 === input.terminalDigit) countAtDigit += 1;
  const totalReportedAges = input.reportedAges.length;
  const sharePercent = (countAtDigit / totalReportedAges) * 100;
  return {
    countAtDigit,
    totalReportedAges,
    sharePercent,
    deviationFromUniformPoints: sharePercent - 10,
  };
};

export const terminalDigitPreferenceShareExample = {
  input: { reportedAges: [23, 24, 25, 30, 35, 41, 52, 60], terminalDigit: 0 },
  output: {
    countAtDigit: 2,
    totalReportedAges: 8,
    sharePercent: 25,
    deviationFromUniformPoints: 15,
  },
} satisfies ToolExample<
  TerminalDigitPreferenceShareInput,
  TerminalDigitPreferenceShareOutput
>;

export const terminalDigitPreferenceShareTool = createSimpleTool({
  id: "demography/terminal-digit-preference-share",
  title: "Terminal Digit Preference Share",
  description:
    "Measure age-heaping on one terminal digit: the percentage of reported ages ending in the chosen digit relative to a uniform ten percent share across digits.",
  inputs: [
    {
      description: "Reported single years of age as non-negative integers.",
      id: "reportedAges",
      kind: "numberList",
      label: "Ages",
    },
    {
      description: "Terminal digit under inspection, from 0 to 9.",
      id: "terminalDigit",
      kind: "integer",
      label: "Terminal digit",
      maximum: 9,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Number of reported ages ending in the chosen digit.",
      id: "countAtDigit",
      kind: "integer",
      label: "Count at digit",
    },
    {
      description: "Total number of reported ages examined.",
      id: "totalReportedAges",
      kind: "integer",
      label: "Total ages",
    },
    {
      description:
        "Share of reported ages ending in the chosen digit, in percent.",
      id: "sharePercent",
      kind: "number",
      label: "Share",
    },
    {
      description:
        "Share minus the uniform ten percent expectation, in percentage points.",
      id: "deviationFromUniformPoints",
      kind: "number",
      label: "Deviation",
    },
  ],
  calculate: (input) =>
    calculateTerminalDigitPreferenceShare(
      input as unknown as TerminalDigitPreferenceShareInput,
    ),
});

export const runTerminalDigitPreferenceShare =
  terminalDigitPreferenceShareTool.execute;
export default terminalDigitPreferenceShareTool;
