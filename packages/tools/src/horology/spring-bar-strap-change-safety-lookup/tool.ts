import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const safetyEntries = {
  forceControl: {
    keyConcern:
      "Compress the spring bar with light, controlled pressure. A slipping tool can scratch the case or damage a lug, and the spring tip can injure skin.",
    step: "force control",
  },
  identification: {
    keyConcern:
      "Confirm whether the strap uses conventional spring bars, quick release, a fixed pin, or a manufacturer-specific system before applying a forked tool.",
    step: "identification",
  },
  installationCheck: {
    keyConcern:
      "After seating both spring-bar tips, perform a gentle retention check and confirm that neither end protrudes into the case or strap body.",
    step: "installation check",
  },
  preparation: {
    keyConcern:
      "Support the watch on a clean, soft, stable surface and keep the crown protected; a NATO-style pass-through strap may not use the same removal method.",
    step: "preparation",
  },
  springBarCondition: {
    keyConcern:
      "Do not reuse a spring bar unless it is known to be serviceable; inspect for rust, cracking, distortion, and uncertain fit.",
    step: "spring-bar condition",
  },
} as const;

export type SpringBarSafetyFocus = keyof typeof safetyEntries;

export type SpringBarSafetyLookupInput = {
  readonly safetyFocus: SpringBarSafetyFocus;
};

export type SpringBarSafetyLookupOutput = {
  readonly keyConcern: string;
  readonly safetyFocus: SpringBarSafetyFocus;
  readonly step: string;
};

export const lookupSpringBarStrapChangeSafety = (
  input: SpringBarSafetyLookupInput,
): SpringBarSafetyLookupOutput => {
  const entry = safetyEntries[input.safetyFocus];
  if (entry === undefined)
    simpleError(
      "safetyFocus",
      "Spring-bar safety focus is not supported.",
      "unsupported_safety_focus",
    );
  return {
    keyConcern: entry.keyConcern,
    safetyFocus: input.safetyFocus,
    step: entry.step,
  };
};

export const springBarSafetyExample = {
  input: { safetyFocus: "identification" },
  output: {
    keyConcern:
      "Confirm whether the strap uses conventional spring bars, quick release, a fixed pin, or a manufacturer-specific system before applying a forked tool.",
    safetyFocus: "identification",
    step: "identification",
  },
} satisfies ToolExample<
  SpringBarSafetyLookupInput,
  SpringBarSafetyLookupOutput
>;

export const springBarSafetyTool = createSimpleTool({
  calculate: (input) =>
    lookupSpringBarStrapChangeSafety({
      safetyFocus: input.safetyFocus as SpringBarSafetyFocus,
    }),
  description:
    "Return a preparation, identification, force-control, spring-bar condition, or installation-check safety control for strap changes.",
  id: "horology/spring-bar-strap-change-safety-lookup",
  inputs: [
    {
      enum: [
        "preparation",
        "identification",
        "forceControl",
        "springBarCondition",
        "installationCheck",
      ],
      id: "safetyFocus",
      kind: "string",
      label: "Spring-bar strap-change safety focus",
    },
  ],
  outputs: [
    { id: "keyConcern", kind: "string", label: "Safety control or concern" },
    {
      id: "safetyFocus",
      kind: "string",
      label: "Spring-bar strap-change safety focus",
    },
    { id: "step", kind: "string", label: "Strap-change step" },
  ],
  title: "Spring Bar Strap Change Safety Lookup",
});

export const runSpringBarSafety = springBarSafetyTool.execute;
export default springBarSafetyTool;
