import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly areas: readonly number[];
  readonly bloomDays: readonly number[];
  readonly observationDays: number;
};
export type Output = {
  readonly areaDays: number;
  readonly equivalentBloomArea: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areas: { type: "array", maxItems: 256, items: { type: "number" } },
    bloomDays: { type: "array", maxItems: 256, items: { type: "number" } },
    observationDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["areas", "bloomDays", "observationDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaDays: { type: "number" },
    equivalentBloomArea: { type: "number" },
  },
  required: ["areaDays", "equivalentBloomArea"],
} as const;
/** Calculate flower strip bloom day weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { areas, bloomDays, observationDays } = request;
  const compute = (): Output => {
    H.sameLength(areas, bloomDays);
    H.positive(observationDays);
    H.domain(
      areas.every((x) => x >= 0) &&
        bloomDays.every((x) => x >= 0 && x <= observationDays),
    );
    return {
      areaDays: H.dot(areas, bloomDays),
      equivalentBloomArea: H.dot(areas, bloomDays) / observationDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { areas: [10, 20], bloomDays: [5, 10], observationDays: 20 },
  output: { areaDays: 250, equivalentBloomArea: 12.5 },
} satisfies ToolExample<Input, Output>;
export const flowerStripBloomDayWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/flower-strip-bloom-day-weight",
    title: "Flower Strip Bloom Day Weight Tool",
    description:
      "Calculate flower strip bloom day weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areas: { type: "array", maxItems: 256, items: { type: "number" } },
        bloomDays: { type: "array", maxItems: 256, items: { type: "number" } },
        observationDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["areas", "bloomDays", "observationDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaDays: { type: "number" },
        equivalentBloomArea: { type: "number" },
      },
      required: ["areaDays", "equivalentBloomArea"],
    },
    ports: {
      inputs: [
        {
          id: "areas",
          label: "Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "bloomDays",
          label: "Bloom Days",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "observationDays",
          label: "Observation Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "areaDays", label: "Area Days", valueType: { type: "number" } },
        {
          id: "equivalentBloomArea",
          label: "Equivalent Bloom Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = flowerStripBloomDayWeightTool.execute;
export default flowerStripBloomDayWeightTool;
