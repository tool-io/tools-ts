import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AbridgedToCompleteExtensionOpenInput = {
  readonly lx: number;
  readonly nmx: number;
};

export type AbridgedToCompleteExtensionOpenOutput = {
  readonly openIntervalPersonYears: number;
  readonly terminalExpectancy: number;
};

export const calculateAbridgedToCompleteExtensionOpen = (
  input: AbridgedToCompleteExtensionOpenInput,
): AbridgedToCompleteExtensionOpenOutput => {
  if (!(input.lx > 0))
    simpleError(
      "lx",
      "Survivors at the open age must be greater than zero.",
      "invalid_lx",
    );
  if (!(input.nmx > 0))
    simpleError(
      "nmx",
      "The terminal death rate must be greater than zero.",
      "invalid_rate",
    );
  return {
    openIntervalPersonYears: input.lx / input.nmx,
    terminalExpectancy: 1 / input.nmx,
  };
};

export const abridgedToCompleteExtensionOpenExample = {
  input: { lx: 5000, nmx: 0.25 },
  output: { openIntervalPersonYears: 20000, terminalExpectancy: 4 },
} satisfies ToolExample<
  AbridgedToCompleteExtensionOpenInput,
  AbridgedToCompleteExtensionOpenOutput
>;

export const abridgedToCompleteExtensionOpenTool = createSimpleTool({
  id: "demography/abridged-to-complete-extension-open",
  title: "Abridged To Complete Extension Open Calculator",
  description:
    "Extend an abridged life table into the terminal open interval using L = l / m for person-years lived and e = 1 / m for the remaining expectancy at the open age.",
  inputs: [
    {
      description:
        "Life-table survivors at the start of the open terminal interval.",
      id: "lx",
      kind: "number",
      label: "l(open)",
      minimum: 0,
    },
    {
      description:
        "Death rate at the open terminal age m-omega per person-year.",
      id: "nmx",
      kind: "number",
      label: "Terminal m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Person-years lived L in the open terminal interval, l / m.",
      id: "openIntervalPersonYears",
      kind: "number",
      label: "L(open)",
    },
    {
      description: "Remaining life expectancy at the open age, 1 / m.",
      id: "terminalExpectancy",
      kind: "number",
      label: "e(open)",
    },
  ],
  calculate: (input) =>
    calculateAbridgedToCompleteExtensionOpen(
      input as unknown as AbridgedToCompleteExtensionOpenInput,
    ),
});

export const runAbridgedToCompleteExtensionOpen =
  abridgedToCompleteExtensionOpenTool.execute;
export default abridgedToCompleteExtensionOpenTool;
