import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type RoundDollarEntry = { readonly amount: number };

export type RoundDollarEntryInput = {
  readonly entries: ReadonlyArray<RoundDollarEntry>;
  readonly increment: number;
};

export type RoundDollarEntryOutput = {
  readonly matchedIndices: ReadonlyArray<number>;
  readonly matchedTotal: number;
  readonly matchedCount: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const decimalParts = (
  value: number,
): { coefficient: bigint; scale: number } => {
  const match = /^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i.exec(String(value));
  const parts =
    match ??
    simpleError(
      "increment",
      "The amount is not a finite decimal.",
      "invalid_amount",
    );
  const coefficient = BigInt(`${parts[1]}${parts[2]}${parts[3] ?? ""}`);
  const scale = (parts[3]?.length ?? 0) - Number(parts[4] ?? 0);
  return { coefficient, scale };
};

const isDecimalMultiple = (amount: number, increment: number): boolean => {
  const numerator = decimalParts(amount);
  const denominator = decimalParts(increment);
  const shift = denominator.scale - numerator.scale;
  return shift >= 0
    ? (numerator.coefficient * 10n ** BigInt(shift)) %
        denominator.coefficient ===
        0n
    : numerator.coefficient %
        (denominator.coefficient * 10n ** BigInt(-shift)) ===
        0n;
};

export const filterRoundDollarEntries = (
  input: RoundDollarEntryInput,
): RoundDollarEntryOutput => {
  if (!Number.isFinite(input.increment) || input.increment <= 0)
    simpleError(
      "increment",
      "The increment must be a positive finite value.",
      "invalid_increment",
    );
  if (!Array.isArray(input.entries))
    simpleError("entries", "Entries must be an array.", "entries_required");
  if (input.entries.length > toolResourceLimits.generatedValues)
    simpleError(
      "entries",
      `Entries must not contain more than ${toolResourceLimits.generatedValues} items.`,
      "resource_limit_exceeded",
    );

  const matchedIndices: number[] = [];
  let matchedTotal = 0;
  for (const [index, entry] of input.entries.entries()) {
    if (typeof entry?.amount !== "number" || !Number.isFinite(entry.amount))
      simpleError(
        `entries.${index}.amount`,
        "Every entry amount must be a finite number.",
        "invalid_entry_amount",
      );
    if (isDecimalMultiple(entry.amount, input.increment)) {
      const nextTotal = matchedTotal + entry.amount;
      if (!Number.isFinite(nextTotal))
        simpleError(
          `entries.${index}.amount`,
          "The matched total is outside the representable numeric range.",
          "result_not_finite",
        );
      matchedIndices.push(index);
      matchedTotal = nextTotal === 0 ? 0 : nextTotal;
    }
  }
  return { matchedCount: matchedIndices.length, matchedIndices, matchedTotal };
};

export const roundDollarEntryExample = {
  input: {
    entries: [
      { amount: 2500 },
      { amount: 1234.56 },
      { amount: -750 },
      { amount: 100 },
    ],
    increment: 50,
  },
  output: {
    matchedCount: 3,
    matchedIndices: [0, 2, 3],
    matchedTotal: 1850,
  },
} satisfies ToolExample<RoundDollarEntryInput, RoundDollarEntryOutput>;

const executeRoundDollarEntry = (
  input: unknown,
): ToolResult<RoundDollarEntryOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const unknownField = Object.keys(input).find(
    (field) => field !== "entries" && field !== "increment",
  );
  if (unknownField !== undefined)
    return invalidInput([
      {
        code: "unknown_field",
        field: unknownField,
        message: `${unknownField} is not a supported input field.`,
      },
    ]);
  if (
    typeof input.increment !== "number" ||
    !Number.isFinite(input.increment) ||
    input.increment <= 0
  )
    return invalidInput([
      {
        code: "invalid_increment",
        field: "increment",
        message: "Increment must be a positive finite number.",
      },
    ]);
  if (!Array.isArray(input.entries))
    return invalidInput([
      {
        code: "entries_required",
        field: "entries",
        message: "Entries must be an array.",
      },
    ]);
  if (input.entries.length > toolResourceLimits.generatedValues)
    return invalidInput([
      {
        code: "resource_limit_exceeded",
        field: "entries",
        message: `Entries must not contain more than ${toolResourceLimits.generatedValues} items.`,
      },
    ]);

  const entries: RoundDollarEntry[] = [];
  for (const [index, entry] of input.entries.entries()) {
    if (!isRecord(entry))
      return invalidInput([
        {
          code: "invalid_entry",
          field: `entries.${index}`,
          message: "Each entry must be an object.",
        },
      ]);
    const unknownEntryField = Object.keys(entry).find(
      (field) => field !== "amount",
    );
    if (unknownEntryField !== undefined)
      return invalidInput([
        {
          code: "unknown_field",
          field: `entries.${index}.${unknownEntryField}`,
          message: `${unknownEntryField} is not a supported entry field.`,
        },
      ]);
    if (typeof entry.amount !== "number" || !Number.isFinite(entry.amount))
      return invalidInput([
        {
          code: "invalid_entry_amount",
          field: `entries.${index}.amount`,
          message: "Every entry amount must be a finite number.",
        },
      ]);
    entries.push({ amount: entry.amount });
  }

  try {
    return toolSuccess(
      filterRoundDollarEntries({ entries, increment: input.increment }),
    );
  } catch (error) {
    if (error instanceof SimpleToolError)
      return invalidInput([
        { code: error.code, field: error.field, message: error.message },
      ]);
    throw error;
  }
};

export const roundDollarEntryTool = defineTool<
  RoundDollarEntryInput,
  RoundDollarEntryOutput
>({
  contractVersion: 1,
  description:
    "Select manual journal entries whose amounts are multiples of a chosen round-dollar increment, such as 50 or 100.",
  execute: executeRoundDollarEntry,
  execution: { kind: "pure" },
  id: "auditing/round-dollar-manual-adjustment-entry-rmae-filter-method",
  inputSchema: {
    additionalProperties: false,
    properties: {
      entries: {
        description: "Manual journal entries with signed finite amounts.",
        items: {
          additionalProperties: false,
          properties: { amount: { type: "number" } },
          required: ["amount"],
          type: "object",
        },
        maxItems: toolResourceLimits.generatedValues,
        type: "array",
      },
      increment: {
        description:
          "Positive amount treated as round; for example, 100 selects multiples of 100.",
        exclusiveMinimum: 0,
        type: "number",
      },
    },
    required: ["entries", "increment"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      matchedCount: { minimum: 0, type: "integer" },
      matchedIndices: {
        items: { minimum: 0, type: "integer" },
        type: "array",
      },
      matchedTotal: { type: "number" },
    },
    required: ["matchedCount", "matchedIndices", "matchedTotal"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "entries",
        label: "Entries",
        required: true,
        valueType: {
          format: "journal-entry-amount",
          items: { type: "object" },
          type: "list",
        },
      },
      {
        id: "increment",
        label: "Round-dollar increment",
        required: true,
        valueType: { format: "currency-amount", type: "number" },
      },
    ],
    outputs: [
      {
        id: "matchedCount",
        label: "Matched count",
        valueType: { type: "integer" },
      },
      {
        id: "matchedIndices",
        label: "Matched indices",
        valueType: { items: { type: "integer" }, type: "list" },
      },
      {
        id: "matchedTotal",
        label: "Matched total",
        valueType: { format: "currency-amount", type: "number" },
      },
    ],
  },
  title: "Round Dollar Manual Adjustment Entry (RMAE) Filter",
});

export const runRoundDollarEntry = roundDollarEntryTool.execute;
export default roundDollarEntryTool;
