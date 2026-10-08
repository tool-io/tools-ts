import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingTariff: number;
  readonly previousIndex: number;
  readonly currentIndex: number;
};
export type Output = {
  readonly indexedTariff: number;
  readonly change: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingTariff: { type: "number" },
    previousIndex: { type: "number", exclusiveMinimum: 0 },
    currentIndex: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["openingTariff", "previousIndex", "currentIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { indexedTariff: { type: "number" }, change: { type: "number" } },
  required: ["indexedTariff", "change"],
} as const;
/** Index a supplied signed tariff by an explicit positive index ratio without choosing index editions or regulatory terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingTariff, previousIndex, currentIndex } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(previousIndex) && previousIndex > 0,
      "previousIndex",
    ),
      previousIndex);
    (H.domain(
      Number.isFinite(currentIndex) && currentIndex > 0,
      "currentIndex",
    ),
      currentIndex);
    return (() => {
      const indexedTariff = openingTariff * (currentIndex / previousIndex);
      return { indexedTariff, change: indexedTariff - openingTariff };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingTariff: 50, previousIndex: 100, currentIndex: 110 },
  output: { indexedTariff: 55.00000000000001, change: 5.000000000000007 },
} satisfies ToolExample<Input, Output>;
export const tariffInflationIndexStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "energy-economics/tariff-inflation-index-step",
    title: "Tariff Inflation Index Step Tool",
    description:
      "Index a supplied signed tariff by an explicit positive index ratio without choosing index editions or regulatory terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingTariff: { type: "number" },
        previousIndex: { type: "number", exclusiveMinimum: 0 },
        currentIndex: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["openingTariff", "previousIndex", "currentIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indexedTariff: { type: "number" },
        change: { type: "number" },
      },
      required: ["indexedTariff", "change"],
    },
    ports: {
      inputs: [
        {
          id: "openingTariff",
          label: "Opening Tariff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previousIndex",
          label: "Previous Index",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentIndex",
          label: "Current Index",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "indexedTariff",
          label: "Indexed Tariff",
          valueType: { type: "number" },
        },
        { id: "change", label: "Change", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tariffInflationIndexStepTool.execute;
export default tariffInflationIndexStepTool;
