import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LegalLetterScopeInput = {
  readonly providedItems: ReadonlyArray<string>;
  readonly requestedItems: ReadonlyArray<string>;
  readonly responseDate: string;
  readonly responseDueDate: string;
};

export type LegalLetterScopeOutput = {
  readonly complete: boolean;
  readonly missingCount: number;
  readonly missingItems: ReadonlyArray<string>;
  readonly responseOnTime: boolean;
};

const normalize = (values: ReadonlyArray<string>, field: string): string[] => {
  if (!Array.isArray(values))
    simpleError(field, `${field} must be an array.`, "item_list_required");
  return values.map((value, index) => {
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        `${field}.${index}`,
        "Item labels must be nonempty strings.",
        "invalid_item",
      );
    return value.trim().toLowerCase();
  });
};

export const checkLegalLetterResponseScope = (
  input: LegalLetterScopeInput,
): LegalLetterScopeOutput => {
  for (const field of ["responseDate", "responseDueDate"] as const)
    if (
      typeof input[field] !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/u.test(input[field])
    )
      simpleError(
        field,
        `${field} must use YYYY-MM-DD format.`,
        "invalid_response_date",
      );
  const requested = new Set(normalize(input.requestedItems, "requestedItems"));
  if (requested.size === 0)
    simpleError(
      "requestedItems",
      "At least one requested item is required.",
      "requested_items_required",
    );
  const provided = new Set(normalize(input.providedItems, "providedItems"));
  const missingItems = [...requested]
    .filter((item) => !provided.has(item))
    .sort();
  return {
    complete: missingItems.length === 0,
    missingCount: missingItems.length,
    missingItems,
    responseOnTime: input.responseDate <= input.responseDueDate,
  };
};

export const legalLetterScopeExample = {
  input: {
    providedItems: ["Insurance", "Tax"],
    requestedItems: ["Insurance", "Litigation", "Tax"],
    responseDate: "2026-04-10",
    responseDueDate: "2026-04-15",
  },
  output: {
    complete: false,
    missingCount: 1,
    missingItems: ["litigation"],
    responseOnTime: true,
  },
} satisfies ToolExample<LegalLetterScopeInput, LegalLetterScopeOutput>;

export const legalLetterScopeTool = createSimpleTool({
  calculate: (input) =>
    checkLegalLetterResponseScope({
      providedItems: input.providedItems as string[],
      requestedItems: input.requestedItems as string[],
      responseDate: input.responseDate as string,
      responseDueDate: input.responseDueDate as string,
    }),
  description:
    "Compare a legal-response scope with requested item labels and compare caller-supplied response and due dates for missing items and timing.",
  id: "auditing/legal-letter-attorney-litigation-response-scope-lookup",
  inputs: [
    { id: "providedItems", kind: "stringList", label: "Provided items" },
    { id: "requestedItems", kind: "stringList", label: "Requested items" },
    { id: "responseDate", kind: "string", label: "Response date" },
    { id: "responseDueDate", kind: "string", label: "Response due date" },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Response scope complete" },
    { id: "missingCount", kind: "integer", label: "Missing items", minimum: 0 },
    { id: "missingItems", kind: "stringList", label: "Missing item labels" },
    { id: "responseOnTime", kind: "boolean", label: "Response on time" },
  ],
  title: "Legal Letter Attorney Litigation Response Scope Lookup",
});

export const runLegalLetterScope = legalLetterScopeTool.execute;
export default legalLetterScopeTool;
