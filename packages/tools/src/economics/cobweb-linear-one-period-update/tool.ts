import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousPrice: number;
  readonly supplyIntercept: number;
  readonly supplySlope: number;
  readonly demandIntercept: number;
  readonly demandSlope: number;
};
export type Output = { readonly nextPrice: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousPrice: { type: "number" },
    supplyIntercept: { type: "number" },
    supplySlope: { type: "number" },
    demandIntercept: { type: "number" },
    demandSlope: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "previousPrice",
    "supplyIntercept",
    "supplySlope",
    "demandIntercept",
    "demandSlope",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextPrice: { type: "number" } },
  required: ["nextPrice"],
} as const;
/** Clear linear current demand a-b*p against supply c+d*p_previous without imposing stability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    previousPrice,
    supplyIntercept,
    supplySlope,
    demandIntercept,
    demandSlope,
  } = request;
  const compute = (): Output => {
    H.positive(demandSlope);
    return {
      nextPrice:
        (demandIntercept - supplyIntercept - supplySlope * previousPrice) /
        demandSlope,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousPrice: 10,
    supplyIntercept: 5,
    supplySlope: 2,
    demandIntercept: 100,
    demandSlope: 3,
  },
  output: { nextPrice: 25 },
} satisfies ToolExample<Input, Output>;
export const cobwebLinearOnePeriodUpdateTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economics/cobweb-linear-one-period-update",
    title: "Cobweb Linear One Period Update Tool",
    description:
      "Clear linear current demand a-b*p against supply c+d*p_previous without imposing stability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousPrice: { type: "number" },
        supplyIntercept: { type: "number" },
        supplySlope: { type: "number" },
        demandIntercept: { type: "number" },
        demandSlope: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "previousPrice",
        "supplyIntercept",
        "supplySlope",
        "demandIntercept",
        "demandSlope",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nextPrice: { type: "number" } },
      required: ["nextPrice"],
    },
    ports: {
      inputs: [
        {
          id: "previousPrice",
          label: "Previous Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "supplyIntercept",
          label: "Supply Intercept",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "supplySlope",
          label: "Supply Slope",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "demandIntercept",
          label: "Demand Intercept",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "demandSlope",
          label: "Demand Slope",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "nextPrice", label: "Next Price", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cobwebLinearOnePeriodUpdateTool.execute;
export default cobwebLinearOnePeriodUpdateTool;
