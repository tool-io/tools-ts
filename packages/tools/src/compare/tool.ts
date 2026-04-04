import { defineTool } from "../core/definition.js";
import { invalidInput, toolSuccess, type ToolResult } from "../core/result.js";

export type CatalogValueType =
  | "boolean"
  | "date"
  | "number"
  | "quantity"
  | "text";
export type CatalogValueStatus = "estimated" | "known";
export type MissingValueReason =
  | "not-applicable"
  | "not-loaded"
  | "not-published"
  | "unknown";

export type CatalogAttributeValue = {
  readonly sourceIds: readonly string[];
  readonly status: CatalogValueStatus;
  readonly type: CatalogValueType;
  readonly unit: string | null;
  readonly value: boolean | number | string;
};

export type CatalogItem = {
  readonly attributes: Readonly<Record<string, CatalogAttributeValue>>;
  readonly categoryIds: readonly string[];
  readonly id: string;
  readonly image: { readonly alt: string; readonly url: string } | null;
  readonly name: string;
  readonly schemaVersion: 1;
  readonly slug: string;
  readonly sourceIds: readonly string[];
  readonly summary: string;
  readonly updatedAt: string;
};

export type AttributeDefinition = {
  readonly canonicalUnit: string | null;
  readonly comparable: boolean;
  readonly description: string;
  readonly id: string;
  readonly label: string;
  readonly order: number;
  readonly preference: "higher" | "lower" | "none";
  readonly quantity: "energy" | "length" | "mass" | "none";
  readonly section: string;
  readonly type: CatalogValueType;
};

export type ComparisonCategory = {
  readonly id: string;
  readonly name: string;
  readonly parentId: string | null;
  readonly sectionOrder: readonly string[];
  readonly slug: string;
};

export type CompareInput = {
  readonly attributeDefinitions: readonly AttributeDefinition[];
  readonly categories: readonly ComparisonCategory[];
  readonly items: readonly CatalogItem[];
};

export type ComparisonCell = {
  readonly comparison: "different" | "equal" | "higher" | "lower" | "missing";
  readonly display: string;
  readonly itemId: string;
  readonly missingReason: MissingValueReason | null;
  readonly normalizedValue: boolean | number | string | null;
  readonly status: CatalogValueStatus | null;
};

export type ComparisonRow = {
  readonly attributeId: string;
  readonly cells: readonly ComparisonCell[];
  readonly description: string;
  readonly hasDifference: boolean;
  readonly label: string;
  readonly preference: AttributeDefinition["preference"];
};

export type ComparisonSectionResult = {
  readonly id: string;
  readonly rows: readonly ComparisonRow[];
  readonly title: string;
};

export type CompareOutput = {
  readonly differenceCount: number;
  readonly itemIds: readonly string[];
  readonly sections: readonly ComparisonSectionResult[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const unitFactors: Readonly<
  Record<string, { dimension: string; factor: number; unit: string }>
> = {
  g: { dimension: "mass", factor: 1, unit: "g" },
  kg: { dimension: "mass", factor: 1000, unit: "g" },
  lb: { dimension: "mass", factor: 453.59237, unit: "g" },
  mm: { dimension: "length", factor: 1, unit: "mm" },
  cm: { dimension: "length", factor: 10, unit: "mm" },
  m: { dimension: "length", factor: 1000, unit: "mm" },
  in: { dimension: "length", factor: 25.4, unit: "mm" },
  kcal: { dimension: "energy", factor: 1, unit: "kcal" },
  kJ: { dimension: "energy", factor: 0.239005736, unit: "kcal" },
};

const normalizedValue = (
  definition: AttributeDefinition,
  attribute: CatalogAttributeValue,
): boolean | number | string => {
  if (
    attribute.type !== "quantity" ||
    typeof attribute.value !== "number" ||
    !attribute.unit
  )
    return attribute.value;
  const conversion = unitFactors[attribute.unit];
  return conversion && conversion.dimension === definition.quantity
    ? attribute.value * conversion.factor
    : attribute.value;
};

const displayValue = (attribute: CatalogAttributeValue): string => {
  if (attribute.type === "boolean") return attribute.value ? "Yes" : "No";
  return `${attribute.value}${attribute.unit ? ` ${attribute.unit}` : ""}`;
};

const titleCase = (value: string): string =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const compareCatalogItems = (
  input: unknown,
): ToolResult<CompareOutput> => {
  if (
    !isRecord(input) ||
    !Array.isArray(input.items) ||
    !Array.isArray(input.attributeDefinitions) ||
    !Array.isArray(input.categories)
  ) {
    return invalidInput([
      {
        code: "comparison_input_required",
        field: "",
        message: "Items, attribute definitions, and categories are required.",
      },
    ]);
  }
  const items = input.items as CatalogItem[];
  const definitions = input.attributeDefinitions as AttributeDefinition[];
  if (items.length < 2)
    return invalidInput([
      {
        code: "item_count",
        field: "items",
        message: "Compare at least two items.",
      },
    ]);
  if (new Set(items.map((item) => item.id)).size !== items.length)
    return invalidInput([
      {
        code: "duplicate_item",
        field: "items",
        message: "Each compared item must be unique.",
      },
    ]);

  const definitionById = new Map(
    definitions.map((definition) => [definition.id, definition]),
  );
  const attributeIds = new Set(
    items.flatMap((item) => Object.keys(item.attributes)),
  );
  const rows = Array.from(attributeIds)
    .map(
      (
        attributeId,
      ): { definition: AttributeDefinition; row: ComparisonRow } | null => {
        const definition = definitionById.get(attributeId);
        if (!definition) return null;
        const present = items.map(
          (item) => item.attributes[attributeId] ?? null,
        );
        const normalized = present.map((attribute) =>
          attribute ? normalizedValue(definition, attribute) : null,
        );
        const known = normalized.filter((value) => value !== null);
        const equal =
          known.length > 1 && known.every((value) => value === known[0]);
        const cells = items.map((item, index): ComparisonCell => {
          const attribute = present[index];
          const value = normalized[index];
          if (!attribute || value === null)
            return {
              comparison: "missing",
              display: "—",
              itemId: item.id,
              missingReason: "unknown",
              normalizedValue: null,
              status: null,
            };
          let comparison: ComparisonCell["comparison"] = equal
            ? "equal"
            : "different";
          if (
            !equal &&
            definition.comparable &&
            typeof value === "number" &&
            known.every((candidate) => typeof candidate === "number")
          ) {
            const numeric = known as number[];
            if (value === Math.max(...numeric)) comparison = "higher";
            else if (value === Math.min(...numeric)) comparison = "lower";
          }
          return {
            comparison,
            display: displayValue(attribute),
            itemId: item.id,
            missingReason: null,
            normalizedValue: value,
            status: attribute.status,
          };
        });
        return {
          definition,
          row: {
            attributeId,
            cells,
            description: definition.description,
            hasDifference: !equal || present.some((value) => value === null),
            label: definition.label,
            preference: definition.preference,
          },
        };
      },
    )
    .filter(
      (
        entry,
      ): entry is { definition: AttributeDefinition; row: ComparisonRow } =>
        entry !== null,
    )
    .sort(
      (first, second) =>
        first.definition.order - second.definition.order ||
        first.definition.label.localeCompare(second.definition.label),
    );

  const sections = new Map<string, ComparisonRow[]>();
  for (const entry of rows)
    sections.set(entry.definition.section, [
      ...(sections.get(entry.definition.section) ?? []),
      entry.row,
    ]);
  const resultSections = Array.from(sections, ([id, sectionRows]) => ({
    id,
    rows: sectionRows,
    title: titleCase(id),
  }));
  return toolSuccess({
    differenceCount: rows.filter((entry) => entry.row.hasDifference).length,
    itemIds: items.map((item) => item.id),
    sections: resultSections,
  });
};

export const compareTool = defineTool<CompareInput, CompareOutput>({
  contractVersion: 1,
  description:
    "Compare two or more catalog items using canonical typed attributes and explicit missing values.",
  execute: compareCatalogItems,
  executionKind: "pure",
  id: "compare",
  inputSchema: {
    properties: {
      attributeDefinitions: { type: "array" },
      categories: { type: "array" },
      items: { type: "array" },
    },
    required: ["attributeDefinitions", "categories", "items"],
    type: "object",
  },
  isOutput: (value): value is CompareOutput =>
    isRecord(value) &&
    Array.isArray(value.sections) &&
    typeof value.differenceCount === "number",
  outputSchema: {
    properties: {
      differenceCount: { type: "number" },
      itemIds: { type: "array" },
      sections: { type: "array" },
    },
    required: ["differenceCount", "itemIds", "sections"],
    type: "object",
  },
  title: "Compare Anything",
});
