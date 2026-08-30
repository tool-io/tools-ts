import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const springDriveEntries = {
  energy: {
    keyDate: "operating principle",
    statement:
      "Spring Drive is mainspring powered but uses electronic regulation; it combines mechanical energy storage with electronic timekeeping.",
  },
  glideMotion: {
    keyDate: "continuous display",
    statement:
      "Seiko attributes Spring Drive's glide motion to one-way, continuously moving hands in a movement without a conventional escapement.",
  },
  hybridPosition: {
    keyDate: "technology classification",
    statement:
      "Spring Drive occupies a hybrid category: mainspring power and mechanical watch construction with an electronic regulator rather than a quartz oscillator driving the display.",
  },
  regulator: {
    keyDate: "Tri-synchro regulator",
    statement:
      "Seiko describes a Tri-synchro regulator that controls and releases mechanical, electrical, and electromechanical energy and replaces the escapement.",
  },
  serviceCaution: {
    keyDate: "caliber-specific",
    statement:
      "Glide motion is a Spring Drive characteristic, not a generic result of any mainspring, electronic circuit, or absence of visible ticks in another movement.",
  },
} as const;

export type SpringDriveFocus = keyof typeof springDriveEntries;

export type SpringDriveLookupInput = {
  readonly principleFocus: SpringDriveFocus;
};

export type SpringDriveLookupOutput = {
  readonly keyDate: string;
  readonly principleFocus: SpringDriveFocus;
  readonly verifiedStatement: string;
};

export const lookupSpringDrivePrinciple = (
  input: SpringDriveLookupInput,
): SpringDriveLookupOutput => {
  const entry = springDriveEntries[input.principleFocus];
  if (entry === undefined)
    simpleError(
      "principleFocus",
      "Spring Drive principle focus is not supported.",
      "unsupported_principle_focus",
    );
  return {
    keyDate: entry.keyDate,
    principleFocus: input.principleFocus,
    verifiedStatement: entry.statement,
  };
};

export const springDriveExample = {
  input: { principleFocus: "glideMotion" },
  output: {
    keyDate: "continuous display",
    principleFocus: "glideMotion",
    verifiedStatement:
      "Seiko attributes Spring Drive's glide motion to one-way, continuously moving hands in a movement without a conventional escapement.",
  },
} satisfies ToolExample<SpringDriveLookupInput, SpringDriveLookupOutput>;

export const springDriveTool = createSimpleTool({
  calculate: (input) =>
    lookupSpringDrivePrinciple({
      principleFocus: input.principleFocus as SpringDriveFocus,
    }),
  description:
    "Return Seiko's explanation of Spring Drive energy, Tri-synchro regulator, glide motion, hybrid positioning, and technology-specific scope.",
  id: "horology/spring-drive-glide-motion-principle-lookup",
  inputs: [
    {
      enum: [
        "energy",
        "regulator",
        "glideMotion",
        "hybridPosition",
        "serviceCaution",
      ],
      id: "principleFocus",
      kind: "string",
      label: "Spring Drive glide-motion principle focus",
    },
  ],
  outputs: [
    { id: "keyDate", kind: "string", label: "Principle context" },
    {
      id: "principleFocus",
      kind: "string",
      label: "Spring Drive glide-motion principle focus",
    },
    {
      id: "verifiedStatement",
      kind: "string",
      label: "Verified Spring Drive statement",
    },
  ],
  title: "Spring Drive Glide Motion Principle Lookup",
});

export const runSpringDrive = springDriveTool.execute;
export default springDriveTool;
