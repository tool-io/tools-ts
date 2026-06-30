import { defineTool } from "../../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type EmptyEntryPolicy = "ignore" | "reject";

export type ParseNumericDatasetInput = {
  readonly emptyEntryPolicy?: EmptyEntryPolicy;
  readonly value: number | string;
};

export type ParseNumericDatasetOutput = {
  readonly normalized: string;
  readonly values: readonly number[];
};

const emptyEntryPolicies = new Set<EmptyEntryPolicy>(["ignore", "reject"]);
const explicitSeparator = /[,;\n\t]/;
const adjacentExplicitSeparators = /[,;\n\t]\s*[,;\n\t]/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const parseNumericDatasetInputSchema = {
  additionalProperties: false,
  properties: {
    emptyEntryPolicy: {
      default: "reject",
      enum: ["ignore", "reject"],
      type: "string",
    },
    value: {
      anyOf: [{ type: "string" }, { type: "number" }],
      description:
        "Finite numbers separated by commas, semicolons, whitespace, tabs, or new lines.",
    },
  },
  required: ["value"],
  type: "object",
} as const;

export const parseNumericDatasetOutputSchema = {
  additionalProperties: false,
  properties: {
    normalized: { type: "string" },
    values: {
      items: { type: "number" },
      minItems: 1,
      type: "array",
    },
  },
  required: ["values", "normalized"],
  type: "object",
} as const;

export const parseNumericDataset = (
  input: unknown,
): ToolResult<ParseNumericDatasetOutput> => {
  if (!isRecord(input)) {
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  }

  const issues: ToolIssue[] = [];
  const value = input.value;
  const emptyEntryPolicy = input.emptyEntryPolicy ?? "reject";

  if (typeof value !== "string" && typeof value !== "number") {
    issues.push({
      code: "string_or_number_required",
      field: "value",
      message: "value must be a string or number.",
    });
  }
  if (
    typeof emptyEntryPolicy !== "string" ||
    !emptyEntryPolicies.has(emptyEntryPolicy as EmptyEntryPolicy)
  ) {
    issues.push({
      code: "invalid_empty_entry_policy",
      field: "emptyEntryPolicy",
      message: "emptyEntryPolicy must be ignore or reject.",
    });
  }
  for (const field of Object.keys(input)) {
    if (field !== "value" && field !== "emptyEntryPolicy") {
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
    }
  }
  if (issues.length > 0) return invalidInput(issues);

  const normalizedInput = String(value).trim();
  if (normalizedInput === "") {
    return invalidInput([
      {
        code: "non_empty_value_required",
        field: "value",
        message: "value must contain at least one number.",
      },
    ]);
  }

  if (
    emptyEntryPolicy === "reject" &&
    (explicitSeparator.test(normalizedInput[0] ?? "") ||
      explicitSeparator.test(normalizedInput.at(-1) ?? "") ||
      adjacentExplicitSeparators.test(normalizedInput))
  ) {
    return invalidInput([
      {
        code: "empty_entry",
        field: "value",
        message: "value contains an empty entry.",
      },
    ]);
  }

  const entries = normalizedInput
    .split(/[,;\n\t]|\s+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry !== "");
  const values = entries.map(Number);

  if (values.length === 0 || !values.every(Number.isFinite)) {
    return invalidInput([
      {
        code: "finite_numbers_required",
        field: "value",
        message: "Every dataset entry must be a finite number.",
      },
    ]);
  }

  return toolSuccess({ normalized: values.join(","), values });
};

export const parseFiniteNumberList = (
  input: unknown,
): readonly number[] | null => {
  const result = parseNumericDataset({
    emptyEntryPolicy: "ignore",
    value: input as number | string,
  });
  return result.ok ? result.output.values : null;
};

export const normalizeNumericDataset = (
  value: unknown,
  emptyEntryPolicy: unknown = "reject",
): string => {
  const result = parseNumericDataset({ emptyEntryPolicy, value });
  return result.ok ? result.output.normalized : "";
};

export const numericDatasetParserTool = defineTool<
  ParseNumericDatasetInput,
  ParseNumericDatasetOutput
>({
  contractVersion: 1,
  description: "Parse and normalize a list of finite numeric values.",
  execute: parseNumericDataset,
  execution: { kind: "pure" },
  id: "parse/numeric-dataset",
  inputSchema: parseNumericDatasetInputSchema,
  outputSchema: parseNumericDatasetOutputSchema,
  ports: {
    inputs: [
      {
        id: "value",
        label: "Dataset",
        required: true,
        valueType: { format: "numeric-dataset", type: "string" },
      },
      {
        id: "emptyEntryPolicy",
        label: "Empty entries",
        required: false,
        valueType: { format: "empty-entry-policy", type: "string" },
      },
    ],
    outputs: [
      {
        id: "values",
        label: "Numeric dataset",
        path: ["values"],
        valueType: { items: { type: "number" }, type: "list" },
      },
      {
        id: "normalized",
        label: "Normalized dataset",
        path: ["normalized"],
        valueType: { format: "numeric-dataset", type: "string" },
      },
    ],
  },
  title: "Numeric Dataset Parser",
});

export default numericDatasetParserTool;
