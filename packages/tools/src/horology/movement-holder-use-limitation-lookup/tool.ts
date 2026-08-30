import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const holderEntries = {
  clamping: {
    keyConcern:
      "Clamp or support only at locations intended for holding; uneven or excessive clamping can distort plates, bridges, springs, or pivots.",
    focus: "clamping",
  },
  cleanliness: {
    keyConcern:
      "Keep the holder, support surfaces, and work area clean so the movement cannot be contaminated or slip during handling.",
    focus: "cleanliness",
  },
  compatibility: {
    keyConcern:
      "Use a holder intended for the movement geometry and operation. A visual match does not establish support-point, depth, or clamp compatibility.",
    focus: "compatibility",
  },
  purpose: {
    keyConcern:
      "A movement holder stabilizes the movement for controlled workshop operations; it is not a substitute for checking pivots, endshake, or gear mesh.",
    focus: "purpose",
  },
  supportPoints: {
    keyConcern:
      "Confirm that support and clamping forces do not act on jewels, balance, springs, levers, or other parts that must remain free to move.",
    focus: "support points",
  },
} as const;

export type MovementHolderFocus = keyof typeof holderEntries;

export type MovementHolderLookupInput = {
  readonly holderFocus: MovementHolderFocus;
};

export type MovementHolderLookupOutput = {
  readonly focus: MovementHolderFocus;
  readonly keyConcern: string;
};

export const lookupMovementHolderUse = (
  input: MovementHolderLookupInput,
): MovementHolderLookupOutput => {
  const entry = holderEntries[input.holderFocus];
  if (entry === undefined)
    simpleError(
      "holderFocus",
      "Movement-holder focus is not supported.",
      "unsupported_holder_focus",
    );
  return { focus: input.holderFocus, keyConcern: entry.keyConcern };
};

export const movementHolderExample = {
  input: { holderFocus: "compatibility" },
  output: {
    focus: "compatibility",
    keyConcern:
      "Use a holder intended for the movement geometry and operation. A visual match does not establish support-point, depth, or clamp compatibility.",
  },
} satisfies ToolExample<MovementHolderLookupInput, MovementHolderLookupOutput>;

export const movementHolderTool = createSimpleTool({
  calculate: (input) =>
    lookupMovementHolderUse({
      holderFocus: input.holderFocus as MovementHolderFocus,
    }),
  description:
    "Return a movement-holder purpose, compatibility, support-point, clamping, or cleanliness control without treating workshop judgment as a universal specification.",
  id: "horology/movement-holder-use-limitation-lookup",
  inputs: [
    {
      enum: [
        "purpose",
        "compatibility",
        "supportPoints",
        "clamping",
        "cleanliness",
      ],
      id: "holderFocus",
      kind: "string",
      label: "Movement-holder use focus",
    },
  ],
  outputs: [
    { id: "focus", kind: "string", label: "Movement-holder use focus" },
    { id: "keyConcern", kind: "string", label: "Movement-holder use concern" },
  ],
  title: "Movement Holder Use Limitation Lookup",
});

export const runMovementHolder = movementHolderTool.execute;
export default movementHolderTool;
