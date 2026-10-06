import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openFlowers: number;
  readonly observedFlowers: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openFlowers: { type: "number", minimum: 0 },
    observedFlowers: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["openFlowers", "observedFlowers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate the supplied open-flower share and non-open remainder on a single positive observation-count basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openFlowers, observedFlowers } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(observedFlowers) && observedFlowers > 0,
      "observedFlowers",
    ),
      observedFlowers);
    H.domain(openFlowers >= 0 && openFlowers <= observedFlowers, "openFlowers");
    return {
      fraction: openFlowers / observedFlowers,
      remainder: observedFlowers - openFlowers,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openFlowers: 30, observedFlowers: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const fieldMarginOpenFlowerObservationShareTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["agroecology", "agriculture"],
        keywords: ["agroecology", "agriculture"],
      },
      id: "agroecology/field-margin-open-flower-observation-share",
      title: "Field Margin Open Flower Observation Share",
      description:
        "Calculate the supplied open-flower share and non-open remainder on a single positive observation-count basis.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openFlowers: { type: "number", minimum: 0 },
          observedFlowers: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["openFlowers", "observedFlowers"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fraction: { type: "number" },
          remainder: { type: "number" },
        },
        required: ["fraction", "remainder"],
      },
      ports: {
        inputs: [
          {
            id: "openFlowers",
            label: "Open Flowers",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedFlowers",
            label: "Observed Flowers",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = fieldMarginOpenFlowerObservationShareTool.execute;
export default fieldMarginOpenFlowerObservationShareTool;
