import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrismegistosNumberCheckInput = {
  readonly identifier: string;
};

export type TrismegistosNumberCheckOutput = {
  readonly normalizedId: string;
  readonly numericId: number;
};

export const calculateTrismegistosNumberCheck = (
  input: TrismegistosNumberCheckInput,
): TrismegistosNumberCheckOutput => {
  const digits = input.identifier.trim().replace(/^TM\s+/i, "");
  if (!/^\d{1,6}$/.test(digits))
    return simpleError(
      "identifier",
      "A Trismegistos id must be 'TM' followed by one to six digits.",
      "invalid_tm_number",
    );
  const numericId = Number.parseInt(digits, 10);
  if (numericId < 1)
    return simpleError(
      "identifier",
      "A Trismegistos id must be greater than zero.",
      "invalid_tm_number",
    );
  return { normalizedId: `TM ${digits}`, numericId };
};

export const trismegistosNumberCheckExample = {
  input: { identifier: "TM 65432" },
  output: { normalizedId: "TM 65432", numericId: 65432 },
} satisfies ToolExample<
  TrismegistosNumberCheckInput,
  TrismegistosNumberCheckOutput
>;

export const trismegistosNumberCheckTool = createSimpleTool({
  id: "epigraphy/trismegistos-number-check",
  title: "Trismegistos Number Format Check",
  description:
    "Check that a Trismegistos identifier consists of the optional prefix 'TM' followed by one to six digits and return it normalized with its numeric value.",
  inputs: [
    {
      description: 'Identifier such as "TM 65432" or a bare number.',
      id: "identifier",
      kind: "string",
      label: "TM identifier",
    },
  ],
  outputs: [
    {
      description: 'Normalized form "TM <digits>".',
      id: "normalizedId",
      kind: "string",
      label: "Normalized",
    },
    {
      description: "Numeric value of the identifier.",
      id: "numericId",
      kind: "integer",
      label: "Numeric id",
    },
  ],
  calculate: (input) =>
    calculateTrismegistosNumberCheck(
      input as unknown as TrismegistosNumberCheckInput,
    ),
});

export const runTrismegistosNumberCheck = trismegistosNumberCheckTool.execute;
export default trismegistosNumberCheckTool;
