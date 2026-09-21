import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yieldPerArea: number;
  readonly price: number;
  readonly variableCost: number;
  readonly precedingCropCredit: number;
  readonly area: number;
};
export type Output = {
  readonly marginPerArea: number;
  readonly totalMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yieldPerArea: { type: "number", minimum: 0 },
    price: { type: "number", minimum: 0 },
    variableCost: { type: "number", minimum: 0 },
    precedingCropCredit: { type: "number" },
    area: { type: "number", minimum: 0 },
  },
  required: [
    "yieldPerArea",
    "price",
    "variableCost",
    "precedingCropCredit",
    "area",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marginPerArea: { type: "number" },
    totalMargin: { type: "number" },
  },
  required: ["marginPerArea", "totalMargin"],
} as const;
/** Calculate crop rotation one year margin term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yieldPerArea, price, variableCost, precedingCropCredit, area } =
    request;
  const compute = (): Output => {
    H.domain(yieldPerArea >= 0 && price >= 0 && variableCost >= 0 && area >= 0);
    return {
      marginPerArea: yieldPerArea * price - variableCost + precedingCropCredit,
      totalMargin:
        area * (yieldPerArea * price - variableCost + precedingCropCredit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    yieldPerArea: 4,
    price: 200,
    variableCost: 500,
    precedingCropCredit: 50,
    area: 10,
  },
  output: { marginPerArea: 350, totalMargin: 3500 },
} satisfies ToolExample<Input, Output>;
export const cropRotationOneYearMarginTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/crop-rotation-one-year-margin-term",
    title: "Crop Rotation One Year Margin Term Tool",
    description:
      "Calculate crop rotation one year margin term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yieldPerArea: { type: "number", minimum: 0 },
        price: { type: "number", minimum: 0 },
        variableCost: { type: "number", minimum: 0 },
        precedingCropCredit: { type: "number" },
        area: { type: "number", minimum: 0 },
      },
      required: [
        "yieldPerArea",
        "price",
        "variableCost",
        "precedingCropCredit",
        "area",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marginPerArea: { type: "number" },
        totalMargin: { type: "number" },
      },
      required: ["marginPerArea", "totalMargin"],
    },
    ports: {
      inputs: [
        {
          id: "yieldPerArea",
          label: "Yield Per Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "variableCost",
          label: "Variable Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "precedingCropCredit",
          label: "Preceding Crop Credit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "marginPerArea",
          label: "Margin Per Area",
          valueType: { type: "number" },
        },
        {
          id: "totalMargin",
          label: "Total Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropRotationOneYearMarginTermTool.execute;
export default cropRotationOneYearMarginTermTool;
