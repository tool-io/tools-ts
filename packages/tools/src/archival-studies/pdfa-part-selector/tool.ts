import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PdfaPartSelectorInput = {
  readonly transparency?: boolean;
  readonly jpeg2000Compression?: boolean;
  readonly embeddedFiles?: boolean;
  readonly nonPdfAttachments?: boolean;
};

export type PdfaPartSelectorOutput = {
  readonly part: number;
  readonly conformanceLabel: string;
  readonly rationale: string;
};

export const calculatePdfaPartSelector = (
  input: PdfaPartSelectorInput,
): PdfaPartSelectorOutput => {
  const transparency = input.transparency ?? false;
  const jpeg2000Compression = input.jpeg2000Compression ?? false;
  const embeddedFiles = input.embeddedFiles ?? false;
  const nonPdfAttachments = input.nonPdfAttachments ?? false;
  const partOneExclusions = [
    ...(transparency ? ["transparency"] : []),
    ...(jpeg2000Compression ? ["JPEG 2000 compression"] : []),
    ...(embeddedFiles ? ["embedded files"] : []),
  ];
  if (nonPdfAttachments) {
    return {
      part: 3,
      conformanceLabel: "PDF/A-3",
      rationale:
        "PDF/A-3 is the lowest part permitting arbitrary non-PDF embedded files.",
    };
  }
  if (partOneExclusions.length > 0) {
    return {
      part: 2,
      conformanceLabel: "PDF/A-2",
      rationale: `PDF/A-2 supports ${partOneExclusions.join(" and ")}, which PDF/A-1 forbids.`,
    };
  }
  return {
    part: 1,
    conformanceLabel: "PDF/A-1",
    rationale: "No advanced features are required beyond the PDF/A-1 baseline.",
  };
};

export const pdfaPartSelectorExample = {
  input: { transparency: true },
  output: {
    part: 2,
    conformanceLabel: "PDF/A-2",
    rationale: "PDF/A-2 supports transparency, which PDF/A-1 forbids.",
  },
} satisfies ToolExample<PdfaPartSelectorInput, PdfaPartSelectorOutput>;

export const pdfaPartSelectorTool = createSimpleTool({
  id: "archival-studies/pdfa-part-selector",
  title: "PDF/A Conformance Part Selector",
  description:
    "Select the lowest ISO 19005 conformance part (PDF/A-1, -2 or -3) that supports the declared document features such as transparency or non-PDF attachments.",
  inputs: [
    {
      default: false,
      description: "Document uses transparency groups.",
      id: "transparency",
      kind: "boolean",
      label: "Transparency",
    },
    {
      default: false,
      description: "Document uses JPEG 2000 image compression.",
      id: "jpeg2000Compression",
      kind: "boolean",
      label: "JPEG 2000",
    },
    {
      default: false,
      description: "Document embeds other files.",
      id: "embeddedFiles",
      kind: "boolean",
      label: "Embedded files",
    },
    {
      default: false,
      description: "Embedded attachments include non-PDF formats.",
      id: "nonPdfAttachments",
      kind: "boolean",
      label: "Non-PDF attachments",
    },
  ],
  outputs: [
    {
      description: "Lowest sufficient ISO 19005 part number (1, 2 or 3).",
      id: "part",
      kind: "integer",
      label: "Part",
    },
    {
      description: "Conformance label such as PDF/A-2.",
      id: "conformanceLabel",
      kind: "string",
      label: "Label",
    },
    {
      description: "Reason the selected part was required.",
      id: "rationale",
      kind: "string",
      label: "Rationale",
    },
  ],
  calculate: (input) =>
    calculatePdfaPartSelector({
      embeddedFiles: (input.embeddedFiles as boolean | undefined) ?? undefined,
      jpeg2000Compression:
        (input.jpeg2000Compression as boolean | undefined) ?? undefined,
      nonPdfAttachments:
        (input.nonPdfAttachments as boolean | undefined) ?? undefined,
      transparency: (input.transparency as boolean | undefined) ?? undefined,
    }),
});

export const runPdfaPartSelector = pdfaPartSelectorTool.execute;
export default pdfaPartSelectorTool;
