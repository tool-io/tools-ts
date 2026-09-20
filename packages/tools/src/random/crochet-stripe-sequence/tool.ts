import { addNumbers } from "../../arithmetic/add-numbers/tool.js";
import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  integer,
  object,
  label,
  countsSchema,
  run,
  choices,
  budget,
  distinct,
  counts,
  simpleError,
  type AcCount,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
export type CrochetStripeSequenceInput = AcSeed & {
  readonly colors: readonly {
    readonly id: string;
    readonly maximumRows: number;
  }[];
  readonly allowedRows: readonly number[];
  readonly totalRows: number;
  readonly stripeCount: number;
};
export type CrochetStripeSequenceOutput = AcReplay & {
  readonly stripes: readonly {
    readonly colorId: string;
    readonly rows: number;
    readonly startRow: number;
    readonly endRowExclusive: number;
  }[];
  readonly stripeCounts: readonly AcCount[];
  readonly rowTotals: readonly { readonly id: string; readonly rows: number }[];
  readonly totalRows: number;
};
export const inputSchema = inputObject({
  colors: array(object({ id: label, maximumRows: integer(0, 512) }), 16, 1),
  allowedRows: array(integer(1, 128), 16, 1),
  totalRows: integer(1, 512),
  stripeCount: integer(1, 32),
});
export const outputSchema = outputObject({
  stripes: array(
    object({
      colorId: label,
      rows: integer(1, 128),
      startRow: integer(0, 511),
      endRowExclusive: integer(1, 512),
    }),
    32,
    1,
  ),
  stripeCounts: countsSchema,
  rowTotals: array(object({ id: label, rows: integer(0, 512) }), 16, 1),
  totalRows: integer(1, 512),
});
const isInput = (v: unknown): v is CrochetStripeSequenceInput =>
  matchesModelInput(v, inputSchema);
export const calculateCrochetStripeSequence = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<CrochetStripeSequenceOutput, "randomness"> => {
      distinct(
        x.colors.map((c) => c.id),
        "colors",
      );
      distinct(x.allowedRows.map(String), "allowedRows");
      const selected: { color: number; rows: number }[] = [],
        used = x.colors.map(() => 0),
        tick = budget(),
        minimum = Math.min(...x.allowedRows),
        maximum = Math.max(...x.allowedRows);
      const search = (remaining: number): boolean => {
        tick();
        const slots = x.stripeCount - selected.length;
        if (slots === 0) return remaining === 0;
        if (remaining < minimum * slots || remaining > maximum * slots)
          return false;
        const candidates: { color: number; rows: number }[] = [];
        x.colors.forEach((c, color) => {
          if (selected[selected.length - 1]?.color === color) return;
          for (const rows of x.allowedRows)
            if (used[color] + rows <= c.maximumRows && rows <= remaining)
              candidates.push({ color, rows });
        });
        for (const c of choices(candidates, random)) {
          selected.push(c);
          used[c.color] += c.rows;
          if (search(remaining - c.rows)) return true;
          used[c.color] -= c.rows;
          selected.pop();
        }
        return false;
      };
      if (!search(x.totalRows))
        return simpleError(
          "totalRows",
          "No exact stripe composition satisfies totals, adjacency and color quotas.",
          "infeasible_sequence",
        );
      let cursor = 0;
      const stripes = selected.map((s) => {
          const startRow = cursor;
          cursor += s.rows;
          return {
            colorId: x.colors[s.color].id,
            rows: s.rows,
            startRow,
            endRowExclusive: cursor,
          };
        }),
        totalRows = addNumbers(stripes.map((s) => s.rows));
      if (totalRows === null || totalRows !== x.totalRows)
        throw new Error("Exact stripe row sum failed arithmetic reuse.");
      return {
        stripes,
        stripeCounts: counts(
          stripes.map((s) => s.colorId),
          x.colors.map((c) => c.id),
        ),
        rowTotals: x.colors.map((c, i) => ({ id: c.id, rows: used[i] })),
        totalRows,
      };
    },
  );
export const crochetStripeSequenceExample = {
  input: {
    colors: [
      { id: "red", maximumRows: 6 },
      { id: "blue", maximumRows: 6 },
    ],
    allowedRows: [2],
    totalRows: 6,
    stripeCount: 3,
    seed: 42,
  },
  output: {
    stripes: [
      { colorId: "blue", rows: 2, startRow: 0, endRowExclusive: 2 },
      { colorId: "red", rows: 2, startRow: 2, endRowExclusive: 4 },
      { colorId: "blue", rows: 2, startRow: 4, endRowExclusive: 6 },
    ],
    stripeCounts: [
      { id: "red", count: 1 },
      { id: "blue", count: 2 },
    ],
    rowTotals: [
      { id: "red", rows: 2 },
      { id: "blue", rows: 4 },
    ],
    totalRows: 6,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  CrochetStripeSequenceInput,
  CrochetStripeSequenceOutput
>;
export const crochetStripeSequenceTool = createModelDefinition<
  CrochetStripeSequenceInput,
  CrochetStripeSequenceOutput
>({
  id: "random/crochet-stripe-sequence",
  title: "Random Crochet Stripe Sequence Plan Generator",
  description:
    "Assign supplied yarn colors and permitted stripe heights under exact row totals, adjacent-color exclusions and color quotas with bounded search.",
  inputSchema,
  outputSchema,
  execute: calculateCrochetStripeSequence,
});
export const runCrochetStripeSequence = crochetStripeSequenceTool.execute;
export default crochetStripeSequenceTool;
