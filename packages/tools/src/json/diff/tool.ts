import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JsonDiffInput = {
  readonly a: string;
  readonly b: string;
};

export type JsonDiffOutput = {
  readonly opCount: number;
  readonly patch: string;
};

export type JsonPatchOp =
  | { op: "add"; path: string; value: unknown }
  | { op: "remove"; path: string }
  | { op: "replace"; path: string; value: unknown };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const parseJsonText = (text: string, field: string): unknown => {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return simpleError(field, "The text is not valid JSON.", "malformed_json");
  }
};

/** Splits an RFC 6901 JSON Pointer into reference tokens. */
export const pointerTokens = (
  pointer: string,
  field: string,
): readonly string[] => {
  if (pointer === "") return [];
  if (!pointer.startsWith("/"))
    simpleError(
      field,
      'A JSON Pointer must be empty or start with "/".',
      "invalid_pointer",
    );
  const tokens: string[] = [];
  for (const rawToken of pointer.split("/").slice(1)) {
    let token = "";
    for (let index = 0; index < rawToken.length; index += 1) {
      const character = rawToken[index]!;
      if (character !== "~") {
        token += character;
        continue;
      }
      const escape = rawToken[index + 1];
      if (escape === "0") token += "~";
      else if (escape === "1") token += "/";
      else
        simpleError(
          field,
          `Invalid "~" escape in JSON Pointer.`,
          "invalid_pointer",
        );
      index += 1;
    }
    tokens.push(token);
  }
  return tokens;
};

/** Builds an RFC 6901 JSON Pointer from reference tokens. */
export const formatPointer = (tokens: readonly string[]): string =>
  tokens
    .map((token) => "/" + token.replaceAll("~", "~0").replaceAll("/", "~1"))
    .join("");

const sameValue = (left: unknown, right: unknown): boolean =>
  left === right || (Number.isNaN(left) && Number.isNaN(right));

/**
 * Emits a minimal, deterministic list of add/remove/replace operations
 * transforming `a` into `b`. Object keys are visited in sorted order;
 * arrays are compared positionally, with trailing removals emitted in
 * descending index order before elementwise recursion, then trailing
 * additions in ascending order. Applying the result to `a` reproduces
 * `b` exactly.
 */
export const diffJson = (a: unknown, b: unknown): JsonPatchOp[] => {
  const ops: JsonPatchOp[] = [];
  const walk = (
    from: unknown,
    into: unknown,
    tokens: readonly string[],
  ): void => {
    if (sameValue(from, into)) return;
    if (isRecord(from) && isRecord(into)) {
      for (const key of Object.keys(from).sort())
        if (!(key in into))
          ops.push({ op: "remove", path: formatPointer([...tokens, key]) });
      for (const key of Object.keys(into).sort())
        if (key in from) walk(from[key], into[key], [...tokens, key]);
      for (const key of Object.keys(into).sort())
        if (!(key in from))
          ops.push({
            op: "add",
            path: formatPointer([...tokens, key]),
            value: into[key],
          });
      return;
    }
    if (Array.isArray(from) && Array.isArray(into)) {
      const shared = Math.min(from.length, into.length);
      for (let index = from.length - 1; index >= shared; index -= 1)
        ops.push({
          op: "remove",
          path: formatPointer([...tokens, String(index)]),
        });
      for (let index = 0; index < shared; index += 1)
        walk(from[index], into[index], [...tokens, String(index)]);
      for (let index = shared; index < into.length; index += 1)
        ops.push({
          op: "add",
          path: formatPointer([...tokens, String(index)]),
          value: into[index],
        });
      return;
    }
    ops.push({ op: "replace", path: formatPointer(tokens), value: into });
  };
  walk(a, b, []);
  return ops;
};

export const calculateJsonDiff = (input: JsonDiffInput): JsonDiffOutput => {
  const a = parseJsonText(input.a, "a");
  const b = parseJsonText(input.b, "b");
  const ops = diffJson(a, b);
  return { opCount: ops.length, patch: JSON.stringify(ops) };
};

export const jsonDiffExample = {
  input: {
    a: '{"name":"Ada","tags":["math","code"],"age":36}',
    b: '{"name":"Ada","tags":["math","pioneer"],"age":37}',
  },
  output: {
    opCount: 2,
    patch:
      '[{"op":"replace","path":"/age","value":37},{"op":"replace","path":"/tags/1","value":"pioneer"}]',
  },
} satisfies ToolExample<JsonDiffInput, JsonDiffOutput>;

export const jsonDiffTool = createSimpleTool({
  calculate: (input) =>
    calculateJsonDiff({ a: input.a as string, b: input.b as string }),
  description:
    "Produce a minimal deterministic RFC 6902-style add/remove/replace patch turning one JSON document into another.",
  id: "json/diff",
  inputs: [
    {
      description: "Starting JSON document.",
      id: "a",
      kind: "string",
      label: "Document A",
    },
    {
      description: "Target JSON document.",
      id: "b",
      kind: "string",
      label: "Document B",
    },
  ],
  outputs: [
    {
      description:
        "Serialized array of add/remove/replace operations with RFC 6901 pointers.",
      id: "patch",
      kind: "string",
      label: "Patch",
    },
    {
      description: "Number of operations in the patch.",
      id: "opCount",
      kind: "integer",
      label: "Operation count",
    },
  ],
  title: "JSON Diff",
});
export const runJsonDiff = jsonDiffTool.execute;
export default jsonDiffTool;
