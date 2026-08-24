import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CacheControlInput = {
  readonly header: string;
};

export type CacheControlOutput = {
  readonly directiveCount: number;
  readonly directives: Record<string, unknown>;
};

const DIRECTIVE_NAME = /^[!#$%&'*+\-.^_`|~0-9a-z]+$/i;
const NUMERIC_VALUE = /^-?\d+(\.\d+)?$/;

/**
 * Tokenizes an RFC 9111 Cache-Control header into a directive record.
 * Valueless directives map to true, numeric values to numbers (quoted or
 * not), everything else to strings; when a directive repeats, the last
 * occurrence wins. Blank segments are ignored.
 */
export const calculateCacheControl = (
  input: CacheControlInput,
): CacheControlOutput => {
  const directives: Record<string, unknown> = {};
  const segments: string[] = [];
  let segmentStart = 0;
  let quoted = false;
  let escaped = false;
  for (let index = 0; index < input.header.length; index += 1) {
    const character = input.header[index];
    if (escaped) escaped = false;
    else if (quoted && character === "\\") escaped = true;
    else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) {
      segments.push(input.header.slice(segmentStart, index));
      segmentStart = index + 1;
    }
  }
  if (quoted || escaped)
    simpleError(
      "header",
      "Cache-Control contains an unterminated quoted value.",
      "invalid_directive",
    );
  segments.push(input.header.slice(segmentStart));
  for (const rawSegment of segments) {
    const segment = rawSegment.trim();
    if (segment === "") continue;
    const equals = segment.indexOf("=");
    const name = (equals === -1 ? segment : segment.slice(0, equals)).trim();
    if (!DIRECTIVE_NAME.test(name))
      simpleError(
        "header",
        `Invalid cache-control directive "${segment}".`,
        "invalid_directive",
      );
    const key = name.toLowerCase();
    if (equals === -1) {
      directives[key] = true;
      continue;
    }
    let valueText = segment.slice(equals + 1).trim();
    if (
      valueText.length >= 2 &&
      valueText.startsWith('"') &&
      valueText.endsWith('"')
    )
      valueText = valueText.slice(1, -1).replace(/\\(["\\])/g, "$1");
    directives[key] = NUMERIC_VALUE.test(valueText)
      ? Number(valueText)
      : valueText;
  }
  return {
    directiveCount: Object.keys(directives).length,
    directives,
  };
};

export const cacheControlExample = {
  input: {
    header: "public, max-age=3600, stale-while-revalidate=60, no-store",
  },
  output: {
    directiveCount: 4,
    directives: {
      "max-age": 3600,
      "no-store": true,
      public: true,
      "stale-while-revalidate": 60,
    },
  },
} satisfies ToolExample<CacheControlInput, CacheControlOutput>;

export const cacheControlTool = createSimpleTool({
  calculate: (rawInput) =>
    calculateCacheControl({ header: rawInput.header as string }),
  description:
    "Tokenize an RFC 9111 Cache-Control header into a record of directives; valueless flags become true and numeric values become numbers.",
  id: "parse/cache-control",
  inputs: [
    {
      description: "Raw Cache-Control header value.",
      id: "header",
      kind: "string",
      label: "Header",
    },
  ],
  outputs: [
    {
      description:
        "Directives keyed by lowercase name; repeated directives keep their last occurrence.",
      id: "directives",
      kind: "object",
      label: "Directives",
    },
    {
      description: "Number of distinct directives after tokenizing.",
      id: "directiveCount",
      kind: "integer",
      label: "Directive count",
    },
  ],
  title: "Cache-Control Header Parser",
});
export const runCacheControl = cacheControlTool.execute;
export default cacheControlTool;
