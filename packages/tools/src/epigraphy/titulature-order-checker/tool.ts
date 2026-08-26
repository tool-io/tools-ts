import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TitulatureOrderCheckerInput = {
  readonly elements: readonly string[];
  readonly strictness?: "standard" | "minimal";
};

export type TitulatureOrderCheckerOutput = {
  readonly isOrdered: boolean;
  readonly violationCount: number;
  readonly violations: readonly string[];
};

const ALIASES: Record<string, string> = {
  imperator: "imperator",
  imp: "imperator",
  tribpotestas: "tribPotestas",
  tribpot: "tribPotestas",
  trp: "tribPotestas",
  tribunicia: "tribPotestas",
  consul: "consul",
  cos: "consul",
  paterpatriae: "paterPatriae",
  pp: "paterPatriae",
};

const normalize = (element: string): string =>
  element.toLowerCase().replace(/[\s·.]/g, "");

export const calculateTitulatureOrderChecker = (
  input: TitulatureOrderCheckerInput,
): TitulatureOrderCheckerOutput => {
  if (input.elements.length === 0)
    return simpleError(
      "elements",
      "At least one titulature element is required.",
      "invalid_elements",
    );
  const canonical: string[] = [];
  for (const element of input.elements) {
    const mapped = ALIASES[normalize(element)];
    if (!mapped)
      return simpleError(
        "elements",
        `Unrecognized titulature element '${element}'.`,
        "invalid_element",
      );
    canonical.push(mapped);
  }
  const strictness = input.strictness ?? "standard";
  const violations: string[] = [];
  const indexOf = (kind: string) => canonical.indexOf(kind);
  const impIdx = indexOf("imperator");
  const trpIdx = indexOf("tribPotestas");
  const cosIdx = indexOf("consul");
  const ppIdx = indexOf("paterPatriae");
  const last = canonical.length - 1;
  if (impIdx >= 0 && impIdx !== 0)
    violations.push("imperator must come first.");
  if (ppIdx >= 0 && ppIdx !== last)
    violations.push("paterPatriae must come last.");
  if (
    strictness === "standard" &&
    trpIdx >= 0 &&
    cosIdx >= 0 &&
    trpIdx > cosIdx
  )
    violations.push("tribPotestas must precede consul.");
  return {
    isOrdered: violations.length === 0,
    violationCount: violations.length,
    violations,
  };
};

export const titulatureOrderCheckerExample = {
  input: { elements: ["IMP", "TR P", "COS", "PP"], strictness: "standard" },
  output: { isOrdered: true, violationCount: 0, violations: [] },
} satisfies ToolExample<
  TitulatureOrderCheckerInput,
  TitulatureOrderCheckerOutput
>;

export const titulatureOrderCheckerTool = createSimpleTool({
  id: "epigraphy/titulature-order-checker",
  title: "Imperial Titulature Element Order Checker",
  description:
    "Check that imperial titulature elements appear in canonical order (imperator first, paterPatriae last, and under the default standard scheme also tribPotestas before consul), accepting common abbreviations IMP TR P COS PP case-insensitively.",
  inputs: [
    {
      description: "Titulature elements in order of appearance.",
      id: "elements",
      kind: "stringList",
      label: "Elements",
    },
    {
      default: "standard",
      description:
        "Rule set: standard adds the tribPotestas-before-consul requirement.",
      enum: ["standard", "minimal"],
      id: "strictness",
      kind: "string",
      label: "Strictness",
    },
  ],
  outputs: [
    {
      description: "True when no ordering violation was found.",
      id: "isOrdered",
      kind: "boolean",
      label: "Ordered",
    },
    {
      description: "Number of ordering violations.",
      id: "violationCount",
      kind: "integer",
      label: "Violations",
    },
    {
      description: "Human-readable violation descriptions in check order.",
      id: "violations",
      kind: "stringList",
      label: "Violation list",
    },
  ],
  calculate: (input) =>
    calculateTitulatureOrderChecker(
      input as unknown as TitulatureOrderCheckerInput,
    ),
});

export const runTitulatureOrderChecker = titulatureOrderCheckerTool.execute;
export default titulatureOrderCheckerTool;
