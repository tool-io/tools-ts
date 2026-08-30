import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const schoolHistory = {
  anticipation:
    "The school treated future-making as a political and social process that could be studied and deliberately shaped.",
  legacy:
    "Its futuribles work contributed to a French tradition of systematic anticipation and long-term social inquiry.",
  limitation:
    "Concrete social visions can embed assumptions about institutions, participation, and authority that require explicit testing.",
  method:
    "Compare plausible social futures, identify conditions for their emergence, and ask what actors could do to move toward or away from them.",
} as const;

export type DeJouvenelFocus = keyof typeof schoolHistory;

export type DeJouvenelInput = {
  readonly focus: DeJouvenelFocus;
};

export type DeJouvenelOutput = {
  readonly focus: DeJouvenelFocus;
  readonly schoolEntry: string;
};

export const lookupDeJouvenelFuturibles = (
  input: DeJouvenelInput,
): DeJouvenelOutput => ({
  focus: input.focus,
  schoolEntry: schoolHistory[input.focus],
});

export const deJouvenelExample = {
  input: { focus: "method" },
  output: {
    focus: "method",
    schoolEntry:
      "Compare plausible social futures, identify conditions for their emergence, and ask what actors could do to move toward or away from them.",
  },
} satisfies ToolExample<DeJouvenelInput, DeJouvenelOutput>;

export const deJouvenelTool = createSimpleTool({
  calculate: (input) =>
    lookupDeJouvenelFuturibles({ focus: input.focus as DeJouvenelFocus }),
  description:
    "Look up a concise context, method, legacy, or limitation entry about de Jouvenel's futuribles anticipation school.",
  id: "futurology/de-jouvenel-futuribles-anticipation-school-lookup",
  inputs: [
    {
      enum: ["method", "anticipation", "legacy", "limitation"],
      id: "focus",
      kind: "string",
      label: "School focus",
    },
  ],
  outputs: [
    { id: "focus", kind: "string", label: "School focus" },
    { id: "schoolEntry", kind: "string", label: "Futuribles school entry" },
  ],
  title: "De Jouvenel Futuribles Anticipation School Lookup",
});

export const runDeJouvenel = deJouvenelTool.execute;
export default deJouvenelTool;
