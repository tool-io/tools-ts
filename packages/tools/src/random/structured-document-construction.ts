import { calculateJsonUnflatten } from "../json/unflatten/tool.js";
import { calculateJsonPrettyPrint } from "../json/pretty-print/tool.js";
import { matchesModelInput } from "../core/model-definition.js";
import { simpleError } from "../core/simple.js";
import {
  generateFieldValue,
  validateGeneratedFields,
  type GeneratedField,
  type GeneratedPrimitive,
} from "./typed-field-generation.js";
import type { GeneratorRandom } from "./generator-random.js";
export type GeneratedDocumentValue =
  | GeneratedPrimitive
  | readonly GeneratedDocumentValue[]
  | { readonly [key: string]: GeneratedDocumentValue };
export type GeneratedDocument = {
  readonly flatFields: Readonly<Record<string, GeneratedPrimitive>>;
  readonly document: { readonly [key: string]: GeneratedDocumentValue };
  readonly pretty: string;
};
const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const generatedJson = (value: unknown): value is GeneratedDocumentValue =>
  value === null ||
  typeof value === "string" ||
  typeof value === "boolean" ||
  (typeof value === "number" && Number.isFinite(value)) ||
  (Array.isArray(value)
    ? value.every(generatedJson)
    : record(value) && Object.values(value).every(generatedJson));
const generatedObject = (
  value: unknown,
): value is { readonly [key: string]: GeneratedDocumentValue } =>
  record(value) && Object.values(value).every(generatedJson);
/** Validate the exact object/contiguous-array subset safe for the existing dot-path core. */
export const validateDocumentFields = (
  fields: readonly GeneratedField[],
  field: string,
): void => {
  validateGeneratedFields(fields, field);
  const reserved = new Set([
    ...Object.getOwnPropertyNames(Object.prototype),
    "prototype",
  ]);
  const children = new Map<string, Set<string>>(),
    leaves = new Set(fields.map((entry) => entry.key));
  for (const entry of fields) {
    const segments = entry.key.split(".");
    if (segments.length > 8)
      simpleError(
        field,
        "Dot paths may have at most eight segments.",
        "path_depth_limit",
      );
    segments.forEach((segment, index) => {
      if (reserved.has(segment))
        simpleError(
          field,
          "Prototype/inherited-property path segments are unsupported by this generator.",
          "unsafe_path_segment",
        );
      const numeric =
        /^(0|[1-9][0-9]?)$/.test(segment) &&
        String(Number(segment)) === segment;
      if (
        (!numeric && !/^[A-Za-z_][A-Za-z0-9_]{0,31}(?![\s\S])/.test(segment)) ||
        (numeric && (index === 0 || Number(segment) > 31))
      )
        simpleError(
          field,
          "Use identifier segments and canonical array indices 0–31 below the object root.",
          "unsupported_path_segment",
        );
      const prefix = segments.slice(0, index).join("."),
        set = children.get(prefix) ?? new Set<string>();
      set.add(segment);
      children.set(prefix, set);
    });
  }
  for (const leaf of leaves)
    if (children.has(leaf))
      simpleError(
        field,
        "A leaf path must not also be a container prefix.",
        "path_conflict",
      );
  for (const [prefix, keys] of children) {
    const numeric = [...keys].filter((key) => /^[0-9]+$/.test(key));
    if (numeric.length) {
      if (!prefix || numeric.length !== keys.size)
        simpleError(
          field,
          "A container cannot mix array indices and named properties.",
          "mixed_path_container",
        );
      const maximum = Math.max(...numeric.map(Number));
      if (keys.size !== maximum + 1)
        simpleError(
          field,
          "Array indices must be contiguous from zero.",
          "sparse_path_array",
        );
    }
  }
};
export const generateStructuredDocument = (
  fields: readonly GeneratedField[],
  random: GeneratorRandom,
  indent: number,
): GeneratedDocument => {
  const flatFields = Object.fromEntries(
    fields.map((entry) => [
      entry.key,
      generateFieldValue(entry, random, "fields"),
    ]),
  );
  const expanded = calculateJsonUnflatten({ flat: flatFields });
  if (!expanded.ok)
    throw new Error(
      "Validated nonconflicting dot paths were rejected by the existing unflatten core.",
    );
  const document = expanded.output.document;
  if (
    !matchesModelInput(document, {
      type: "object",
      additionalProperties: true,
    }) ||
    !generatedObject(document)
  )
    throw new Error(
      "Unflatten core returned a nonportable generated document.",
    );
  const formatted = calculateJsonPrettyPrint({
    json: JSON.stringify(document),
    indent,
  });
  if (!formatted.ok)
    throw new Error("Generated finite JSON was rejected by the formatter.");
  return { flatFields, document, pretty: formatted.output.pretty };
};
