import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const CAP_PROFILES = [
  "convex",
  "plane",
  "depressed",
  "infundibuliform",
  "campanulate",
  "conical",
  "umbonate",
] as const;

const PROFILE_DESCRIPTIONS: Record<(typeof CAP_PROFILES)[number], string> = {
  convex: "Cap surface curves outward in a rounded profile.",
  plane: "Cap surface is approximately flat.",
  depressed: "Cap center is lower than the surrounding surface.",
  infundibuliform: "Cap is deeply funnel-shaped from center to margin.",
  campanulate: "Cap has a bell-shaped profile.",
  conical: "Cap tapers upward to a cone-shaped apex.",
  umbonate: "Cap has a distinct raised central boss or umbo.",
};

export type CapShapeProfile = (typeof CAP_PROFILES)[number];
export type CapShapeProfileClassifierInput = {
  readonly profile: CapShapeProfile;
};
export type CapShapeProfileClassifierOutput = {
  readonly capShapeClass: CapShapeProfile;
  readonly profileDescription: string;
};

export const capShapeProfileClassifierExample = {
  input: { profile: "convex" },
  output: {
    capShapeClass: "convex",
    profileDescription: "Cap surface curves outward in a rounded profile.",
  },
} satisfies ToolExample<
  CapShapeProfileClassifierInput,
  CapShapeProfileClassifierOutput
>;

export const calculateCapShapeProfileClassifier = (
  input: CapShapeProfileClassifierInput,
): CapShapeProfileClassifierOutput => {
  const profileDescription = PROFILE_DESCRIPTIONS[input.profile];
  if (profileDescription === undefined)
    return simpleError(
      "profile",
      "Select a supported cap profile.",
      "invalid_profile",
    );
  return { capShapeClass: input.profile, profileDescription };
};

export const capShapeProfileClassifierTool = createSimpleTool({
  id: "mycology/cap-shape-profile-classifier",
  title: "Cap Shape Profile",
  description:
    "Classify a mushroom cap's longitudinal profile and return a plain-language definition of the selected mycological term.",
  inputs: [
    { enum: CAP_PROFILES, id: "profile", kind: "string", label: "Profile" },
  ],
  outputs: [
    {
      enum: CAP_PROFILES,
      id: "capShapeClass",
      kind: "string",
      label: "Cap shape class",
    },
    {
      id: "profileDescription",
      kind: "string",
      label: "Profile description",
    },
  ],
  calculate: (input) =>
    calculateCapShapeProfileClassifier({
      profile: input.profile as CapShapeProfile,
    }),
});
export const runCapShapeProfileClassifier =
  capShapeProfileClassifierTool.execute;
export default capShapeProfileClassifierTool;
