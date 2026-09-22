import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spreads: number;
  readonly imagesPerSpread: number;
  readonly reservedSlots: number;
  readonly requiredImages: number;
};
export type Output = {
  readonly usableSlots: number;
  readonly remainingSlots: number;
  readonly missingSlots: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spreads: { type: "integer", minimum: 0 },
    imagesPerSpread: { type: "integer", minimum: 0 },
    reservedSlots: { type: "integer", minimum: 0 },
    requiredImages: { type: "integer", minimum: 0 },
  },
  required: ["spreads", "imagesPerSpread", "reservedSlots", "requiredImages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableSlots: { type: "integer" },
    remainingSlots: { type: "integer" },
    missingSlots: { type: "integer" },
  },
  required: ["usableSlots", "remainingSlots", "missingSlots"],
} as const;
/** Calculate portfolio spread image count capacity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spreads, imagesPerSpread, reservedSlots, requiredImages } = request;
  const compute = (): Output => {
    H.integer(spreads, 0);
    H.integer(imagesPerSpread, 0);
    H.integer(reservedSlots, 0, spreads * imagesPerSpread);
    H.integer(requiredImages, 0);
    return {
      usableSlots: spreads * imagesPerSpread - reservedSlots,
      remainingSlots:
        spreads * imagesPerSpread - reservedSlots - requiredImages,
      missingSlots: Math.max(
        0,
        requiredImages - spreads * imagesPerSpread + reservedSlots,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    spreads: 10,
    imagesPerSpread: 4,
    reservedSlots: 5,
    requiredImages: 30,
  },
  output: { usableSlots: 35, remainingSlots: 5, missingSlots: 0 },
} satisfies ToolExample<Input, Output>;
export const portfolioSpreadImageCountCapacityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/portfolio-spread-image-count-capacity",
    title: "Portfolio Spread Image Count Capacity Tool",
    description:
      "Calculate portfolio spread image count capacity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spreads: { type: "integer", minimum: 0 },
        imagesPerSpread: { type: "integer", minimum: 0 },
        reservedSlots: { type: "integer", minimum: 0 },
        requiredImages: { type: "integer", minimum: 0 },
      },
      required: [
        "spreads",
        "imagesPerSpread",
        "reservedSlots",
        "requiredImages",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableSlots: { type: "integer" },
        remainingSlots: { type: "integer" },
        missingSlots: { type: "integer" },
      },
      required: ["usableSlots", "remainingSlots", "missingSlots"],
    },
    ports: {
      inputs: [
        {
          id: "spreads",
          label: "Spreads",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "imagesPerSpread",
          label: "Images Per Spread",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reservedSlots",
          label: "Reserved Slots",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredImages",
          label: "Required Images",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "usableSlots",
          label: "Usable Slots",
          valueType: { type: "integer" },
        },
        {
          id: "remainingSlots",
          label: "Remaining Slots",
          valueType: { type: "integer" },
        },
        {
          id: "missingSlots",
          label: "Missing Slots",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = portfolioSpreadImageCountCapacityTool.execute;
export default portfolioSpreadImageCountCapacityTool;
