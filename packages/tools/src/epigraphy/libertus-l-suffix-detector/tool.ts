import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type LibertusLSuffixDetectorInput = {
  readonly nameTokens: readonly string[];
};

export type LibertusLSuffixDetectorOutput = {
  readonly libertusMarker: boolean;
  readonly markerIndex: number;
};

export const calculateLibertusLSuffixDetector = (
  input: LibertusLSuffixDetectorInput,
): LibertusLSuffixDetectorOutput => {
  const idx = input.nameTokens.findIndex((t) => /^l\.?$/i.test(t.trim()));
  return { libertusMarker: idx >= 0, markerIndex: idx };
};

export const libertusLSuffixDetectorExample = {
  input: {
    nameTokens: ["Marcus", "Licinius", "L.", "Successus"],
  },
  output: {
    libertusMarker: true,
    markerIndex: 2,
  },
} satisfies ToolExample<
  LibertusLSuffixDetectorInput,
  LibertusLSuffixDetectorOutput
>;

export const libertusLSuffixDetectorTool = createSimpleTool({
  id: "epigraphy/libertus-l-suffix-detector",
  title: "Libertus Status Indicator L Suffix Detector",
  description:
    "Detect the L (libertus) status marker token following a name in an inscription.",
  inputs: [
    {
      description: "Name tokens in order.",
      id: "nameTokens",
      kind: "stringList",
      label: "Name tokens",
    },
  ],
  outputs: [
    {
      description: "An L marker token is present.",
      id: "libertusMarker",
      kind: "boolean",
      label: "Libertus marker",
    },
    {
      description: "Index of the marker token, -1 when absent.",
      id: "markerIndex",
      kind: "integer",
      label: "Marker index",
    },
  ],
  calculate: (input) =>
    calculateLibertusLSuffixDetector(
      input as unknown as LibertusLSuffixDetectorInput,
    ),
});

export const runLibertusLSuffixDetector = libertusLSuffixDetectorTool.execute;
export default libertusLSuffixDetectorTool;
