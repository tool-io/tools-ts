import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const frames = ["utopian", "dystopian", "neutral"] as const;

export type TechFramingBiasInput = {
  readonly evidenceFrames: ReadonlyArray<string>;
};

export type TechFramingBiasOutput = {
  readonly balancedEvidenceRequired: boolean;
  readonly dominantFrame: (typeof frames)[number];
  readonly frameCounts: ReadonlyArray<number>;
  readonly oneSidedFraming: boolean;
};

export const checkTechFramingBias = (
  input: TechFramingBiasInput,
): TechFramingBiasOutput => {
  if (!Array.isArray(input.evidenceFrames) || input.evidenceFrames.length === 0)
    simpleError(
      "evidenceFrames",
      "At least one evidence frame is required.",
      "evidence_frames_required",
    );
  const counts = { utopian: 0, dystopian: 0, neutral: 0 };
  for (const [index, frame] of input.evidenceFrames.entries()) {
    if (
      typeof frame !== "string" ||
      !frames.includes(frame.trim().toLowerCase() as (typeof frames)[number])
    )
      simpleError(
        `evidenceFrames.${index}`,
        "Evidence frames must be utopian, dystopian, or neutral.",
        "invalid_evidence_frame",
      );
    counts[frame.trim().toLowerCase() as keyof typeof counts] += 1;
  }
  const dominantFrame = frames.find(
    (frame) => counts[frame] === Math.max(...Object.values(counts)),
  )!;
  return {
    balancedEvidenceRequired: counts.utopian === 0 || counts.dystopian === 0,
    dominantFrame,
    frameCounts: frames.map((frame) => counts[frame]),
    oneSidedFraming: counts.utopian === 0 || counts.dystopian === 0,
  };
};

export const techFramingBiasExample = {
  input: { evidenceFrames: ["utopian", "neutral", "dystopian", "utopian"] },
  output: {
    balancedEvidenceRequired: false,
    dominantFrame: "utopian",
    frameCounts: [2, 1, 1],
    oneSidedFraming: false,
  },
} satisfies ToolExample<TechFramingBiasInput, TechFramingBiasOutput>;

export const techFramingBiasTool = createSimpleTool({
  calculate: (input) =>
    checkTechFramingBias({ evidenceFrames: input.evidenceFrames as string[] }),
  description:
    "Check a caller-coded technology evidence set for one-sided utopian or dystopian framing.",
  id: "futurology/utopian-dystopian-tech-framing-bias-checker",
  inputs: [
    {
      description:
        "One utopian, dystopian, or neutral label per evidence item.",
      id: "evidenceFrames",
      kind: "stringList",
      label: "Evidence frames",
    },
  ],
  outputs: [
    {
      id: "balancedEvidenceRequired",
      kind: "boolean",
      label: "Balanced evidence required",
    },
    {
      enum: [...frames],
      id: "dominantFrame",
      kind: "string",
      label: "Dominant frame",
    },
    { id: "frameCounts", kind: "numberList", label: "Frame counts" },
    { id: "oneSidedFraming", kind: "boolean", label: "One-sided framing" },
  ],
  title: "Utopian Dystopian Tech Framing Bias Checker",
});

export const runTechFramingBias = techFramingBiasTool.execute;
export default techFramingBiasTool;
