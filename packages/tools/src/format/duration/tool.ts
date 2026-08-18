import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type DurationStyle = "compact" | "iso";

export type FormatDurationInput = {
  readonly seconds: number;
  readonly style?: DurationStyle;
};

export type FormatDurationOutput = {
  readonly formatted: string;
};

export const formatDurationInputSchema = {
  additionalProperties: false,
  properties: {
    seconds: {
      description: "Duration in seconds; fractional parts are truncated.",
      minimum: 0,
      type: "number",
    },
    style: {
      description: "Compact human text or ISO-8601 duration.",
      enum: ["compact", "iso"],
      type: "string",
    },
  },
  required: ["seconds"],
  type: "object",
} as const;

export const formatDurationOutputSchema = {
  additionalProperties: false,
  properties: {
    formatted: {
      description: 'Formatted duration such as "1h 01m 01s" or "PT1H1M1S".',
      type: "string",
    },
  },
  required: ["formatted"],
  type: "object",
} as const;

export const formatDurationExample = {
  input: { seconds: 3661, style: "compact" },
  output: { formatted: "1h 01m 01s" },
} satisfies ToolExample<FormatDurationInput, FormatDurationOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const SECONDS_PER_DAY = 86_400;
const SECONDS_PER_HOUR = 3_600;
const SECONDS_PER_MINUTE = 60;

export const isFormatDurationOutput = (
  value: unknown,
): value is FormatDurationOutput =>
  isRecord(value) && typeof value.formatted === "string";

export const calculateFormatDuration = (
  input: unknown,
): ToolResult<FormatDurationOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set(["seconds", "style"]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const rawSeconds = input.seconds;
  if (rawSeconds === undefined)
    issues.push({
      code: "seconds_required",
      field: "seconds",
      message: "seconds is required.",
    });
  else if (
    typeof rawSeconds !== "number" ||
    !Number.isFinite(rawSeconds) ||
    (rawSeconds as number) < 0
  )
    issues.push({
      code: "seconds_invalid",
      field: "seconds",
      message: "seconds must be a nonnegative finite number.",
    });

  const style = input.style ?? "compact";
  if (style !== "compact" && style !== "iso")
    issues.push({
      code: "style_invalid",
      field: "style",
      message: "style must be compact or iso.",
    });

  if (issues.length > 0) return invalidInput(issues);

  let remaining = Math.floor(rawSeconds as number);
  const days = Math.floor(remaining / SECONDS_PER_DAY);
  remaining -= days * SECONDS_PER_DAY;
  const hours = Math.floor(remaining / SECONDS_PER_HOUR);
  remaining -= hours * SECONDS_PER_HOUR;
  const minutes = Math.floor(remaining / SECONDS_PER_MINUTE);
  const seconds = remaining - minutes * SECONDS_PER_MINUTE;

  if (style === "iso") {
    const dayPart = days > 0 ? `${days}D` : "";
    const timePart =
      `P${dayPart}T` +
      (hours > 0 ? `${hours}H` : "") +
      (minutes > 0 ? `${minutes}M` : "") +
      `${seconds}S`;
    return toolSuccess({ formatted: timePart });
  }

  if (days === 0 && hours === 0 && minutes === 0)
    return toolSuccess({ formatted: `${seconds}s` });

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (days > 0 || hours > 0) parts.push(`${hours}h`);
  parts.push(`${String(minutes).padStart(2, "0")}m`);
  parts.push(`${String(seconds).padStart(2, "0")}s`);
  return toolSuccess({ formatted: parts.join(" ") });
};

export const formatDurationTool = defineTool<
  FormatDurationInput,
  FormatDurationOutput
>({
  contractVersion: 1,
  description:
    "Format a duration in seconds as compact human text or an ISO-8601 duration.",
  discovery: {
    aliases: ["humanize-duration", "seconds-to-text", "time-format"],
    keywords: ["duration", "format", "time"],
  },
  execute: calculateFormatDuration,
  execution: { kind: "pure" },
  id: "format/duration",
  inputSchema: formatDurationInputSchema,
  outputSchema: formatDurationOutputSchema,
  ports: {
    inputs: [
      {
        description: "Duration in seconds.",
        id: "seconds",
        label: "Seconds",
        required: true,
        valueType: { format: "duration", type: "number", unit: "s" },
      },
      {
        description: "Output convention.",
        id: "style",
        label: "Style",
        valueType: { format: "duration-style", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Formatted duration text.",
        id: "formatted",
        label: "Formatted",
        valueType: { format: "display-string", type: "string" },
      },
    ],
  },
  title: "Duration Formatter",
});

export const runFormatDuration = formatDurationTool.execute;
export default formatDurationTool;
