import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StratalTerminationTypeLookupInput = {
  readonly termination: string;
};

export type StratalTerminationTypeLookupOutput = {
  readonly contact: string;
  readonly terminationClass: string;
  readonly description: string;
};

const TERMINATIONS: Record<
  string,
  { contact: string; terminationClass: string; description: string }
> = {
  onlap: {
    contact: "basal",
    terminationClass: "progressive updip termination",
    description:
      "Strata terminate updip against an inclined older surface; indicates deepening or rising relative sea level during deposition.",
  },
  downlap: {
    contact: "basal",
    terminationClass: "downslope termination",
    description:
      "Inclined strata terminate downdip onto an inclined or horizontal older surface; records progradation of clinoforms.",
  },
  toplap: {
    contact: "top",
    terminationClass: "low-angle discordant top termination",
    description:
      "Initially inclined strata terminate beneath a nearly horizontal upper surface; indicates sediment supply keeping pace with accommodation (stillstand).",
  },
  truncation: {
    contact: "top",
    terminationClass: "erosional termination",
    description:
      "Strata are cut by an erosional surface; records relative sea-level fall, tectonic uplift, or channel incision.",
  },
  concordance: {
    contact: "either",
    terminationClass: "conformable",
    description:
      "Strata parallel the bounding surface with no terminations; deposition and accommodation changed in step.",
  },
};

export const calculateStratalTerminationTypeLookup = (
  input: StratalTerminationTypeLookupInput,
): StratalTerminationTypeLookupOutput => {
  const entry = TERMINATIONS[input.termination];
  if (entry === undefined)
    simpleError(
      "termination",
      "Unknown termination type; pick one from the supported list.",
      "unknown_termination",
    );
  return {
    contact: entry.contact,
    terminationClass: entry.terminationClass,
    description: entry.description,
  };
};

export const stratalTerminationTypeLookupExample = {
  input: { termination: "onlap" },
  output: {
    contact: "basal",
    terminationClass: "progressive updip termination",
    description:
      "Strata terminate updip against an inclined older surface; indicates deepening or rising relative sea level during deposition.",
  },
} satisfies ToolExample<
  StratalTerminationTypeLookupInput,
  StratalTerminationTypeLookupOutput
>;

export const stratalTerminationTypeLookupTool = createSimpleTool({
  id: "geology/stratal-termination-type-lookup",
  title: "Stratal Termination Type Lookup",
  description:
    "Classify a seismic/stratigraphic stratal termination (onlap, downlap, toplap, truncation, concordance) by its contact position and process meaning.",
  inputs: [
    {
      description: "Stratal termination type.",
      enum: Object.keys(TERMINATIONS),
      id: "termination",
      kind: "string",
      label: "Termination",
    },
  ],
  outputs: [
    {
      description:
        "Which bounding surface carries the termination: basal, top, or either.",
      id: "contact",
      kind: "string",
      label: "Contact",
    },
    {
      description: "Geometric class of the termination.",
      id: "terminationClass",
      kind: "string",
      label: "Class",
    },
    {
      description: "Process interpretation of the termination.",
      id: "description",
      kind: "string",
      label: "Interpretation",
    },
  ],
  calculate: (input) =>
    calculateStratalTerminationTypeLookup(
      input as unknown as StratalTerminationTypeLookupInput,
    ),
});

export const runStratalTerminationTypeLookup =
  stratalTerminationTypeLookupTool.execute;
export default stratalTerminationTypeLookupTool;
