import { resourceLimitIssue } from "../../core/limits.js";
import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type MediaSupportVerdict =
  | "no-data"
  | "none"
  | "partial"
  | "ready";

export type MediaCodecSupport = {
  readonly name: string;
  readonly supported: boolean;
};

export type MediaSupportInput = {
  readonly codecs: readonly MediaCodecSupport[];
};

export type MediaSupportOutput = {
  readonly coveragePercent: number | null;
  readonly issues: readonly string[];
  readonly supportedCodecs: readonly string[];
  readonly unsupportedCodecs: readonly string[];
  readonly verdict: MediaSupportVerdict;
};

export const mediaSupportInputSchema = {
  additionalProperties: false,
  properties: {
    codecs: {
      description: "Codec probe results in reporting order.",
      items: {
        additionalProperties: false,
        properties: {
          name: {
            description: "Codec identifier, such as h264 or av1.",
            maxLength: 64,
            minLength: 1,
            type: "string",
          },
          supported: { type: "boolean" },
        },
        required: ["name", "supported"],
        type: "object",
      },
      type: "array",
    },
  },
  required: ["codecs"],
  type: "object",
} as const;

export const mediaSupportOutputSchema = {
  additionalProperties: false,
  properties: {
    coveragePercent: {
      anyOf: [
        { maximum: 100, minimum: 0, type: "number" },
        { type: "null" },
      ],
      description: "Share of probed codecs supported.",
    },
    issues: {
      description: "Stable machine-facing notice codes.",
      items: { type: "string" },
      type: "array",
    },
    supportedCodecs: {
      description: "Names of supported codecs in input order.",
      items: { type: "string" },
      type: "array",
    },
    unsupportedCodecs: {
      description: "Names of unsupported codecs in input order.",
      items: { type: "string" },
      type: "array",
    },
    verdict: {
      description: "Overall playback readiness classification.",
      enum: ["no-data", "none", "partial", "ready"],
      type: "string",
    },
  },
  required: [
    "verdict",
    "supportedCodecs",
    "unsupportedCodecs",
    "coveragePercent",
    "issues",
  ],
  type: "object",
} as const;

export const mediaSupportExample = {
  input: {
    codecs: [
      { name: "h264", supported: true },
      { name: "hevc", supported: true },
      { name: "av1", supported: false },
      { name: "vp9", supported: true },
    ],
  },
  output: {
    coveragePercent: 75,
    issues: [],
    supportedCodecs: ["h264", "hevc", "vp9"],
    unsupportedCodecs: ["av1"],
    verdict: "partial",
  },
} satisfies ToolExample<MediaSupportInput, MediaSupportOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isMediaSupportOutput = (
  value: unknown,
): value is MediaSupportOutput =>
  isRecord(value) &&
  typeof value.verdict === "string" &&
  Array.isArray(value.supportedCodecs);

export const calculateMediaSupport = (
  input: unknown,
): ToolResult<MediaSupportOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "codecs")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawCodecs = input.codecs;
  if (rawCodecs === undefined)
    return invalidInput([
      ...issues,
      {
        code: "codecs_required",
        field: "codecs",
        message: "codecs is required.",
      },
    ]);
  if (!Array.isArray(rawCodecs))
    return invalidInput([
      ...issues,
      {
        code: "codecs_invalid",
        field: "codecs",
        message: "codecs must be an array of codec probe results.",
      },
    ]);
  const limitIssue = resourceLimitIssue(
    "generatedValues",
    rawCodecs.length,
    "codecs",
  );
  if (limitIssue) return invalidInput([...issues, limitIssue]);
  rawCodecs.forEach((entry, index) => {
    if (!isRecord(entry)) {
      issues.push({
        code: "codec_required",
        field: `codecs.${index}`,
        message: `codecs.${index} must be an object.`,
      });
      return;
    }
    for (const key of Object.keys(entry))
      if (key !== "name" && key !== "supported")
        issues.push({
          code: "unknown_field",
          field: `codecs.${index}.${key}`,
          message: `${key} is not a supported codec field.`,
        });
    const { name, supported } = entry;
    if (
      typeof name !== "string" ||
      name.length < 1 ||
      name.length > 64
    )
      issues.push({
        code: "codec_name_invalid",
        field: `codecs.${index}.name`,
        message: `codecs.${index}.name must be a string of 1 to 64 characters.`,
      });
    if (typeof supported !== "boolean")
      issues.push({
        code: "codec_supported_invalid",
        field: `codecs.${index}.supported`,
        message: `codecs.${index}.supported must be a boolean.`,
      });
  });
  if (issues.length > 0) return invalidInput(issues);

  const codecs = rawCodecs as readonly MediaCodecSupport[];
  const supportedCodecs = codecs
    .filter((codec) => codec.supported)
    .map((codec) => codec.name);
  const unsupportedCodecs = codecs
    .filter((codec) => !codec.supported)
    .map((codec) => codec.name);
  const coveragePercent =
    codecs.length === 0
      ? null
      : (supportedCodecs.length / codecs.length) * 100;

  const outputIssues: string[] = [];
  let verdict: MediaSupportVerdict;
  if (codecs.length === 0) {
    verdict = "no-data";
    outputIssues.push("no-codecs-reported");
  } else if (supportedCodecs.length === codecs.length) verdict = "ready";
  else if (supportedCodecs.length === 0) verdict = "none";
  else verdict = "partial";

  return toolSuccess({
    coveragePercent,
    issues: outputIssues,
    supportedCodecs,
    unsupportedCodecs,
    verdict,
  });
};

export const mediaSupportTool = defineTool<
  MediaSupportInput,
  MediaSupportOutput
>({
  contractVersion: 1,
  description:
    "Summarize codec probe results into playback readiness with coverage and gaps.",
  discovery: {
    aliases: ["codec-check", "video-support"],
    keywords: ["codecs", "media", "playback", "video"],
  },
  execute: calculateMediaSupport,
  execution: { kind: "pure" },
  id: "check/media-support",
  inputSchema: mediaSupportInputSchema,
  outputSchema: mediaSupportOutputSchema,
  ports: {
    inputs: [
      {
        description: "Codec support probe from the surface.",
        id: "probe",
        label: "Codec probe",
        path: [],
        required: true,
        valueType: { format: "device-probe/codecs", type: "object" },
      },
    ],
    outputs: [
      {
        description: "Overall playback readiness classification.",
        id: "verdict",
        label: "Verdict",
        valueType: { format: "media-support-verdict", type: "string" },
      },
      {
        description: "Supported codec names in input order.",
        id: "supportedCodecs",
        label: "Supported codecs",
        valueType: {
          format: "codec-names",
          items: { format: "codec-name", type: "string" },
          type: "list",
        },
      },
      {
        description: "Unsupported codec names in input order.",
        id: "unsupportedCodecs",
        label: "Unsupported codecs",
        valueType: {
          format: "codec-names",
          items: { format: "codec-name", type: "string" },
          type: "list",
        },
      },
      {
        description: "Share of probed codecs that are supported.",
        id: "coveragePercent",
        label: "Coverage",
        valueType: { format: "ratio-percent", type: "number", unit: "%" },
      },
      {
        description: "Stable machine-facing notice codes.",
        id: "issues",
        label: "Issues",
        valueType: {
          format: "issue-codes",
          items: { type: "string" },
          type: "list",
        },
      },
    ],
  },
  title: "Media Support Checker",
});

export const runMediaSupportCheck = mediaSupportTool.execute;
export default mediaSupportTool;
