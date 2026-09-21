import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRows: number;
  readonly secondRows: number;
  readonly excludedFirst: number;
  readonly excludedSecond: number;
};
export type Output = {
  readonly firstShare: number;
  readonly effectiveRows: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRows: { type: "integer", minimum: 0 },
    secondRows: { type: "integer", minimum: 0 },
    excludedFirst: { type: "integer", minimum: 0 },
    excludedSecond: { type: "integer", minimum: 0 },
  },
  required: ["firstRows", "secondRows", "excludedFirst", "excludedSecond"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstShare: { type: "number" },
    effectiveRows: { type: "integer" },
    defined: { type: "boolean" },
  },
  required: ["firstShare", "effectiveRows", "defined"],
} as const;
/** Calculate intercrop row proportion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRows, secondRows, excludedFirst, excludedSecond } = request;
  const compute = (): Output => {
    H.integer(firstRows, 0);
    H.integer(secondRows, 0);
    H.integer(excludedFirst, 0, firstRows);
    H.integer(excludedSecond, 0, secondRows);
    return {
      firstShare:
        firstRows + secondRows - excludedFirst - excludedSecond > 0
          ? (firstRows - excludedFirst) /
            (firstRows + secondRows - excludedFirst - excludedSecond)
          : 0,
      effectiveRows: firstRows + secondRows - excludedFirst - excludedSecond,
      defined: firstRows + secondRows - excludedFirst - excludedSecond > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRows: 4, secondRows: 6, excludedFirst: 1, excludedSecond: 1 },
  output: { firstShare: 0.375, effectiveRows: 8, defined: true },
} satisfies ToolExample<Input, Output>;
export const intercropRowProportionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/intercrop-row-proportion",
    title: "Intercrop Row Proportion Tool",
    description:
      "Calculate intercrop row proportion from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRows: { type: "integer", minimum: 0 },
        secondRows: { type: "integer", minimum: 0 },
        excludedFirst: { type: "integer", minimum: 0 },
        excludedSecond: { type: "integer", minimum: 0 },
      },
      required: ["firstRows", "secondRows", "excludedFirst", "excludedSecond"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstShare: { type: "number" },
        effectiveRows: { type: "integer" },
        defined: { type: "boolean" },
      },
      required: ["firstShare", "effectiveRows", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "firstRows",
          label: "First Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondRows",
          label: "Second Rows",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedFirst",
          label: "Excluded First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedSecond",
          label: "Excluded Second",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "firstShare",
          label: "First Share",
          valueType: { type: "number" },
        },
        {
          id: "effectiveRows",
          label: "Effective Rows",
          valueType: { type: "integer" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = intercropRowProportionTool.execute;
export default intercropRowProportionTool;
