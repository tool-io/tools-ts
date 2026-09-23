import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly whorls: number;
  readonly nominalPerWhorl: number;
  readonly missing: number;
  readonly extra: number;
};
export type Output = {
  readonly expected: number;
  readonly observed: number;
  readonly discrepancy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    whorls: { type: "integer", minimum: 0 },
    nominalPerWhorl: { type: "integer", minimum: 0 },
    missing: { type: "integer", minimum: 0 },
    extra: { type: "integer", minimum: 0 },
  },
  required: ["whorls", "nominalPerWhorl", "missing", "extra"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expected: { type: "integer" },
    observed: { type: "integer" },
    discrepancy: { type: "integer" },
  },
  required: ["expected", "observed", "discrepancy"],
} as const;
/** Calculate botanical petal count whorl budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { whorls, nominalPerWhorl, missing, extra } = request;
  const compute = (): Output => {
    H.integer(whorls, 0);
    H.integer(nominalPerWhorl, 0);
    H.integer(missing, 0, whorls * nominalPerWhorl);
    H.integer(extra, 0);
    return {
      expected: whorls * nominalPerWhorl,
      observed: whorls * nominalPerWhorl - missing + extra,
      discrepancy: extra - missing,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { whorls: 2, nominalPerWhorl: 5, missing: 1, extra: 2 },
  output: { expected: 10, observed: 11, discrepancy: 1 },
} satisfies ToolExample<Input, Output>;
export const botanicalPetalCountWhorlBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/botanical-petal-count-whorl-budget",
    title: "Botanical Petal Count Whorl Budget Tool",
    description:
      "Calculate botanical petal count whorl budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        whorls: { type: "integer", minimum: 0 },
        nominalPerWhorl: { type: "integer", minimum: 0 },
        missing: { type: "integer", minimum: 0 },
        extra: { type: "integer", minimum: 0 },
      },
      required: ["whorls", "nominalPerWhorl", "missing", "extra"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expected: { type: "integer" },
        observed: { type: "integer" },
        discrepancy: { type: "integer" },
      },
      required: ["expected", "observed", "discrepancy"],
    },
    ports: {
      inputs: [
        {
          id: "whorls",
          label: "Whorls",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "nominalPerWhorl",
          label: "Nominal Per Whorl",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "missing",
          label: "Missing",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "extra",
          label: "Extra",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "expected", label: "Expected", valueType: { type: "integer" } },
        { id: "observed", label: "Observed", valueType: { type: "integer" } },
        {
          id: "discrepancy",
          label: "Discrepancy",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = botanicalPetalCountWhorlBudgetTool.execute;
export default botanicalPetalCountWhorlBudgetTool;
