import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const overcoilEntries = {
  breathing: {
    keyDate: "terminal curve",
    statement:
      "The raised terminal curve is shaped so the hairspring is intended to breathe more concentrically as it winds and unwinds.",
  },
  geometry: {
    keyDate: "1795",
    statement:
      "Breguet's official history dates the raised, inward-curved final coil to 1795.",
  },
  limitation: {
    keyDate: "design-specific",
    statement:
      "Overcoil geometry is calculated for the balance and spring system; adding a terminal curve is not a universal guarantee of isochronism.",
  },
  purpose: {
    keyDate: "concentric breathing",
    statement:
      "The overcoil changes the terminal-spring geometry to reduce asymmetric spring action and pivot side pressure.",
  },
} as const;

export type OvercoilFocus = keyof typeof overcoilEntries;

export type OvercoilLookupInput = {
  readonly overcoilFocus: OvercoilFocus;
};

export type OvercoilLookupOutput = {
  readonly keyDate: string;
  readonly overcoilFocus: OvercoilFocus;
  readonly verifiedStatement: string;
};

export const lookupBreguetOvercoilTerminalCurve = (
  input: OvercoilLookupInput,
): OvercoilLookupOutput => {
  const entry = overcoilEntries[input.overcoilFocus];
  if (entry === undefined)
    simpleError(
      "overcoilFocus",
      "Overcoil focus is not supported.",
      "unsupported_overcoil_focus",
    );
  return {
    keyDate: entry.keyDate,
    overcoilFocus: input.overcoilFocus,
    verifiedStatement: entry.statement,
  };
};

export const overcoilLookupExample = {
  input: { overcoilFocus: "geometry" },
  output: {
    keyDate: "1795",
    overcoilFocus: "geometry",
    verifiedStatement:
      "Breguet's official history dates the raised, inward-curved final coil to 1795.",
  },
} satisfies ToolExample<OvercoilLookupInput, OvercoilLookupOutput>;

export const overcoilLookupTool = createSimpleTool({
  calculate: (input) =>
    lookupBreguetOvercoilTerminalCurve({
      overcoilFocus: input.overcoilFocus as OvercoilFocus,
    }),
  description:
    "Return the documented geometry, date, purpose, breathing intent, or limitation of a Breguet overcoil terminal curve.",
  id: "horology/breguet-overcoil-terminal-curve-lookup",
  inputs: [
    {
      enum: ["geometry", "breathing", "purpose", "limitation"],
      id: "overcoilFocus",
      kind: "string",
      label: "Breguet overcoil focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Key date or category" },
    { id: "overcoilFocus", kind: "string", label: "Breguet overcoil focus" },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified overcoil statement",
    },
  ],
  title: "Breguet Overcoil Terminal Curve Lookup",
});

export const runOvercoilLookup = overcoilLookupTool.execute;
export default overcoilLookupTool;
