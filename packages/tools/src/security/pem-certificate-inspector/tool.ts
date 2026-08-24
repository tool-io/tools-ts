import { base64ToBytes } from "../../core/encoding.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PemCertificateInspectorInput = {
  readonly pem: string;
};

export type PemCertificateInspectorOutput = {
  readonly blockCount: number;
  readonly decodedByteCounts: readonly number[];
  readonly headerLineCount: number;
  readonly labels: readonly string[];
};

const BLOCK_PATTERN =
  /-----BEGIN ([A-Z0-9 ]+)-----([\s\S]*?)-----END ([A-Z0-9 ]+)-----/g;
const BASE64_LINE = /^[A-Za-z0-9+/=\s]*$/;

/**
 * Scans PEM armor blocks and reports block metadata only: the BEGIN/END
 * labels, decoded byte counts of each base64 body, and how many
 * non-base64 header lines (for example "Proc-Type:") were found. No
 * ASN.1 structure is decoded or validated.
 */
export const calculatePemCertificateInspector = (
  input: PemCertificateInspectorInput,
): PemCertificateInspectorOutput => {
  const labels: string[] = [];
  const decodedByteCounts: number[] = [];
  let headerLineCount = 0;
  let matchCount = 0;
  for (const match of input.pem.matchAll(BLOCK_PATTERN)) {
    const [, beginLabel, body, endLabel] = match;
    if (beginLabel !== endLabel)
      simpleError(
        "pem",
        `Block ${matchCount + 1} has mismatched BEGIN and END labels.`,
        "malformed_pem",
      );
    const lines = (body ?? "").split(/\r?\n/);
    const base64Chunks: string[] = [];
    for (const line of lines) {
      if (line.trim() === "") continue;
      if (!BASE64_LINE.test(line)) {
        headerLineCount += 1;
        continue;
      }
      base64Chunks.push(line.trim());
    }
    const compact = base64Chunks.join("");
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(compact) || compact.length % 4 !== 0)
      simpleError(
        "pem",
        `Block ${matchCount + 1} (${beginLabel}) contains invalid base64.`,
        "malformed_pem",
      );
    labels.push(beginLabel!);
    decodedByteCounts.push(base64ToBytes(compact, "pem").length);
    matchCount += 1;
  }
  if (matchCount === 0)
    simpleError(
      "pem",
      "No PEM blocks with BEGIN and END armor were found.",
      "missing_pem_block",
    );
  return {
    blockCount: matchCount,
    decodedByteCounts,
    headerLineCount,
    labels,
  };
};

export const pemCertificateInspectorExample = {
  input: {
    pem: "-----BEGIN CERTIFICATE-----\ndGVzdCBjZXJ0aWZpY2F0ZQ==\n-----END CERTIFICATE-----",
  },
  output: {
    blockCount: 1,
    decodedByteCounts: [16],
    headerLineCount: 0,
    labels: ["CERTIFICATE"],
  },
} satisfies ToolExample<
  PemCertificateInspectorInput,
  PemCertificateInspectorOutput
>;

export const pemCertificateInspectorTool = createSimpleTool({
  calculate: (rawInput) =>
    calculatePemCertificateInspector({ pem: rawInput.pem as string }),
  description:
    "Inspect PEM armored text for block metadata only: BEGIN/END labels, decoded byte counts, and RFC 1421 header line count; no ASN.1 parsing.",
  id: "security/pem-certificate-inspector",
  inputs: [
    {
      description:
        'Text containing one or more "-----BEGIN LABEL----- ... -----END LABEL-----" blocks.',
      id: "pem",
      kind: "string",
      label: "PEM text",
    },
  ],
  outputs: [
    {
      description: "Number of complete PEM blocks found.",
      id: "blockCount",
      kind: "integer",
      label: "Block count",
    },
    {
      description: "Decoded byte length of each block's base64 body, in order.",
      id: "decodedByteCounts",
      kind: "numberList",
      label: "Decoded byte counts",
    },
    {
      description:
        "Non-empty body lines that are not base64, such as Proc-Type or DEK-Info headers.",
      id: "headerLineCount",
      kind: "integer",
      label: "Header line count",
    },
    {
      description: "BEGIN label of each block in order.",
      id: "labels",
      kind: "stringList",
      label: "Labels",
    },
  ],
  title: "PEM Block Inspector",
});
export const runPemCertificateInspector = pemCertificateInspectorTool.execute;
export default pemCertificateInspectorTool;
