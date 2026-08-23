import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { parseJsonText, pointerTokens } from "../diff/tool.js";

export type JsonApplyPatchInput = {
  readonly document: string;
  readonly patch: string;
};

export type JsonApplyPatchOutput = {
  readonly appliedOpCount: number;
  readonly result: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

type Op =
  | { kind: "add"; path: string; value: unknown }
  | { kind: "remove"; path: string }
  | { kind: "replace"; path: string; value: unknown };

const parsePatch = (patchText: string, field: string): readonly Op[] => {
  const parsed = parseJsonText(patchText, field);
  if (!Array.isArray(parsed))
    simpleError(
      field,
      "The patch must be a JSON array of operations.",
      "invalid_patch",
    );
  const entries = parsed as unknown[];
  return entries.map((rawEntry) => {
    if (!isRecord(rawEntry))
      simpleError(field, "Every operation must be an object.", "invalid_patch");
    const entry = rawEntry as Record<string, unknown>;
    if (entry.op !== "add" && entry.op !== "remove" && entry.op !== "replace")
      simpleError(
        field,
        'Only the "add", "remove", and "replace" operations are supported.',
        "invalid_patch_op",
      );
    if (typeof entry.path !== "string")
      simpleError(
        field,
        'Every operation needs a string "path".',
        "invalid_patch",
      );
    if ((entry.op === "add" || entry.op === "replace") && !("value" in entry))
      simpleError(
        field,
        `"${entry.op}" operations need a "value".`,
        "invalid_patch",
      );
    return entry.op === "remove"
      ? { kind: "remove", path: entry.path as string }
      : ({
          kind: entry.op,
          path: entry.path as string,
          value: entry.value,
        } as Op);
  });
};

const arrayIndexToken = (
  token: string,
  length: number,
  allowEnd: boolean,
  field: string,
): number => {
  if (!/^(0|[1-9]\d*)$/.test(token))
    simpleError(
      field,
      `Array index "${token}" is not a non-negative integer.`,
      "invalid_pointer",
    );
  const index = Number(token);
  if (index > length || (!allowEnd && index >= length))
    simpleError(
      field,
      `Array index ${token} is out of bounds.`,
      "index_out_of_bounds",
    );
  return index;
};

/**
 * Applies one parsed operation to a JSON value. Root-level add and
 * replace swap the whole document (root removal is rejected); other
 * operations mutate containers in place and hand the document back.
 */
const applyOp = (document: unknown, op: Op, field: string): unknown => {
  const tokens = pointerTokens(op.path, field);
  if (tokens.length === 0) {
    if (op.kind === "remove")
      simpleError(
        field,
        "Removing the whole document is not supported.",
        "invalid_patch_target",
      );
    return (op as { readonly value?: unknown }).value;
  }
  let parent: unknown = document;
  for (let depth = 0; depth < tokens.length - 1; depth += 1) {
    const token = tokens[depth]!;
    if (isRecord(parent)) {
      if (!(token in parent))
        simpleError(
          field,
          `Path segment "${token}" does not exist.`,
          "path_not_found",
        );
      parent = parent[token];
      continue;
    }
    if (Array.isArray(parent)) {
      parent = parent[arrayIndexToken(token, parent.length, false, field)];
      continue;
    }
    simpleError(
      field,
      "An intermediate path segment is not a container.",
      "path_not_found",
    );
  }
  const token = tokens[tokens.length - 1]!;
  if (isRecord(parent)) {
    if (op.kind === "add") {
      parent[token] = op.value;
      return document;
    }
    if (!(token in parent))
      simpleError(
        field,
        `Path segment "${token}" does not exist.`,
        "path_not_found",
      );
    if (op.kind === "replace") parent[token] = op.value;
    else delete parent[token];
    return document;
  }
  if (Array.isArray(parent)) {
    if (op.kind === "add") {
      const index =
        token === "-"
          ? parent.length
          : arrayIndexToken(token, parent.length, true, field);
      parent.splice(index, 0, op.value);
      return document;
    }
    const index = arrayIndexToken(token, parent.length, false, field);
    if (op.kind === "replace") parent[index] = op.value;
    else parent.splice(index, 1);
    return document;
  }
  simpleError(
    field,
    "The target parent is not an object or array.",
    "path_not_found",
  );
};

export const calculateJsonApplyPatch = (
  input: JsonApplyPatchInput,
): JsonApplyPatchOutput => {
  const ops = parsePatch(input.patch, "patch");
  let working = parseJsonText(input.document, "document");
  for (const op of ops) working = applyOp(working, op, "patch");
  return {
    appliedOpCount: ops.length,
    result: JSON.stringify(working),
  };
};

export const jsonApplyPatchExample = {
  input: {
    document: '{"name":"Ada","tags":["math"]}',
    patch:
      '[{"op":"replace","path":"/name","value":"Grace"},{"op":"add","path":"/tags/-","value":"navy"}]',
  },
  output: {
    appliedOpCount: 2,
    result: '{"name":"Grace","tags":["math","navy"]}',
  },
} satisfies ToolExample<JsonApplyPatchInput, JsonApplyPatchOutput>;

export const jsonApplyPatchTool = createSimpleTool({
  calculate: (input) =>
    calculateJsonApplyPatch({
      document: input.document as string,
      patch: input.patch as string,
    }),
  description:
    "Apply a minimal RFC 6902-style add/remove/replace patch with RFC 6901 pointers to a JSON document.",
  id: "json/apply-patch",
  inputs: [
    {
      description: "JSON text to patch.",
      id: "document",
      kind: "string",
      label: "Document",
    },
    {
      description: "Serialized array of add/remove/replace operations.",
      id: "patch",
      kind: "string",
      label: "Patch",
    },
  ],
  outputs: [
    {
      description: "Patched document serialized as compact JSON.",
      id: "result",
      kind: "string",
      label: "Result",
    },
    {
      description: "Number of operations applied.",
      id: "appliedOpCount",
      kind: "integer",
      label: "Applied operations",
    },
  ],
  title: "JSON Patch Applier",
});
export const runJsonApplyPatch = jsonApplyPatchTool.execute;
export default jsonApplyPatchTool;
