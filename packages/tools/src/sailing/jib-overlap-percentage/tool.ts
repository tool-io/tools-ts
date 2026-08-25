import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JibOverlapPercentageInput = {
  readonly foreTriangleM2: number;
  readonly jibAreaM2: number;
};

export type JibOverlapPercentageOutput = {
  readonly overlapPercent: number;
};

export const jibOverlapPercentageExample = {
  input: { foreTriangleM2: 50, jibAreaM2: 75 },
  output: { overlapPercent: 150 },
} satisfies ToolExample<JibOverlapPercentageInput, JibOverlapPercentageOutput>;

export const jibOverlapPercentageTool = createSimpleTool({
  calculate: (input) => {
    const jibAreaM2 = input.jibAreaM2 as number;
    const foreTriangleM2 = input.foreTriangleM2 as number;
    if (jibAreaM2 <= 0)
      simpleError("jibAreaM2", "Jib area must be positive.", "invalid_jib");
    if (foreTriangleM2 <= 0)
      simpleError(
        "foreTriangleM2",
        "Foretriangle area must be positive.",
        "invalid_foretriangle",
      );
    return {
      overlapPercent: (jibAreaM2 / foreTriangleM2) * 100,
    };
  },
  description:
    "Compute jib area as a percentage of foretriangle area. This is an area-ratio proxy; formal LP overlap percentage requires the luff-perpendicular and J dimensions.",
  id: "sailing/jib-overlap-percentage",
  inputs: [
    {
      description: "Foretriangle area I * J / 2.",
      id: "foreTriangleM2",
      kind: "number",
      label: "Foretriangle area",
      minimum: 0,
      unit: "m\u00B2",
    },
    {
      description: "Measured area of the jib.",
      id: "jibAreaM2",
      kind: "number",
      label: "Jib area",
      minimum: 0,
      unit: "m\u00B2",
    },
  ],
  outputs: [
    {
      description:
        "Jib-to-foretriangle area percentage; 100 percent means equal areas.",
      id: "overlapPercent",
      kind: "number",
      label: "Overlap percentage",
      unit: "%",
    },
  ],
  title: "Jib Overlap Percentage",
});
export const runJibOverlapPercentage = jibOverlapPercentageTool.execute;
export default jibOverlapPercentageTool;
