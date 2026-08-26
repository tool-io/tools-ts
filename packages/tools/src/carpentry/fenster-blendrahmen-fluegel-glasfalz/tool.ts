import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WindowProfileSystem = "euroframe-60" | "euroframe-70";

export type WindowGlazingRebateLookupInput = {
  readonly profileSystem: WindowProfileSystem;
};

export type WindowGlazingRebateLookupOutput = {
  readonly frameDepthMm: number;
  readonly glazingRebateDepthMm: number;
  readonly glazingRebateWidthMm: number;
};

const WINDOW_PROFILES: Record<
  WindowProfileSystem,
  {
    readonly frameDepthMm: number;
    readonly glazingRebateDepthMm: number;
  }
> = {
  "euroframe-60": { frameDepthMm: 60, glazingRebateDepthMm: 15 },
  "euroframe-70": { frameDepthMm: 70, glazingRebateDepthMm: 16 },
};

export const windowGlazingRebateExample = {
  input: { profileSystem: "euroframe-70" },
  output: {
    frameDepthMm: 70,
    glazingRebateDepthMm: 16,
    glazingRebateWidthMm: 12,
  },
} satisfies ToolExample<
  WindowGlazingRebateLookupInput,
  WindowGlazingRebateLookupOutput
>;

export const windowGlazingRebateLookupTool = createSimpleTool({
  id: "carpentry/fenster-blendrahmen-fluegel-glasfalz",
  title: "Window Glazing Rebate Lookup",
  description:
    "Look up the frame depth and glazing rebate dimensions for Euroframe window profile systems.",
  inputs: [
    {
      description: "Window profile system of the blend frame and sash.",
      enum: ["euroframe-60", "euroframe-70"],
      id: "profileSystem",
      kind: "string",
      label: "Profile system",
    },
  ],
  outputs: [
    {
      description: "Frame construction depth in millimeters.",
      id: "frameDepthMm",
      kind: "number",
      label: "Frame depth",
      unit: "mm",
    },
    {
      description: "Glazing rebate depth in millimeters.",
      id: "glazingRebateDepthMm",
      kind: "number",
      label: "Glazing rebate depth",
      unit: "mm",
    },
    {
      description: "Glazing rebate width in millimeters.",
      id: "glazingRebateWidthMm",
      kind: "number",
      label: "Glazing rebate width",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const profileSystem = input.profileSystem as WindowProfileSystem;
    if (!(profileSystem in WINDOW_PROFILES))
      simpleError(
        "profileSystem",
        "Unknown window profile system.",
        "unknown_profile_system",
      );
    return {
      ...WINDOW_PROFILES[profileSystem],
      glazingRebateWidthMm: 12,
    };
  },
});
export const runWindowGlazingRebateLookup =
  windowGlazingRebateLookupTool.execute;
export default windowGlazingRebateLookupTool;
