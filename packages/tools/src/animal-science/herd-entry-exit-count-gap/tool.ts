import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: string;
  readonly entries: string;
  readonly exits: string;
  readonly observedClosing: string;
};
export type Output = {
  readonly expectedClosingDecimal: string;
  readonly discrepancyDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "string", maxLength: 8192, format: "integer-decimal" },
    entries: { type: "string", maxLength: 8192, format: "integer-decimal" },
    exits: { type: "string", maxLength: 8192, format: "integer-decimal" },
    observedClosing: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["opening", "entries", "exits", "observedClosing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedClosingDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    discrepancyDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["expectedClosingDecimal", "discrepancyDecimal"],
} as const;
/** Calculate herd entry exit count gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { opening, entries, exits, observedClosing } = request;
  const compute = (): Output => {
    return (() => {
      const a = H.decimal(opening),
        b = H.decimal(entries),
        c = H.decimal(exits),
        d = H.decimal(observedClosing);
      H.domain(a >= 0n && b >= 0n && c >= 0n && d >= 0n);
      const expected = a + b - c;
      return {
        expectedClosingDecimal: expected.toString(),
        discrepancyDecimal: (d - expected).toString(),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { opening: "100", entries: "8", exits: "5", observedClosing: "104" },
  output: { expectedClosingDecimal: "103", discrepancyDecimal: "1" },
} satisfies ToolExample<Input, Output>;
export const herdEntryExitCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/herd-entry-exit-count-gap",
    title: "Herd Entry Exit Count Gap Tool",
    description:
      "Calculate herd entry exit count gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opening: { type: "string", maxLength: 8192, format: "integer-decimal" },
        entries: { type: "string", maxLength: 8192, format: "integer-decimal" },
        exits: { type: "string", maxLength: 8192, format: "integer-decimal" },
        observedClosing: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["opening", "entries", "exits", "observedClosing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedClosingDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        discrepancyDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["expectedClosingDecimal", "discrepancyDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "opening",
          label: "Opening",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "entries",
          label: "Entries",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "exits",
          label: "Exits",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "observedClosing",
          label: "Observed Closing",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        {
          id: "expectedClosingDecimal",
          label: "Expected Closing Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "discrepancyDecimal",
          label: "Discrepancy Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = herdEntryExitCountGapTool.execute;
export default herdEntryExitCountGapTool;
