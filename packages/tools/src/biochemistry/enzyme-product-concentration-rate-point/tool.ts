import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly productConcentrationChange: number;
  readonly elapsedTime: number;
};
export type Output = { readonly averageConcentrationRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productConcentrationChange: { type: "number" },
    elapsedTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["productConcentrationChange", "elapsedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { averageConcentrationRate: { type: "number" } },
  required: ["averageConcentrationRate"],
} as const;
/** Divide an explicit signed product concentration change by positive elapsed time without fitting enzyme kinetics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { productConcentrationChange, elapsedTime } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(elapsedTime) && elapsedTime > 0, "elapsedTime"),
      elapsedTime);
    return {
      averageConcentrationRate: productConcentrationChange / elapsedTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { productConcentrationChange: 12, elapsedTime: 4 },
  output: { averageConcentrationRate: 3 },
} satisfies ToolExample<Input, Output>;
export const enzymeProductConcentrationRatePointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biochemistry", "biology"],
        keywords: ["biochemistry", "biology"],
      },
      id: "biochemistry/enzyme-product-concentration-rate-point",
      title: "Enzyme Product Concentration Rate Point",
      description:
        "Divide an explicit signed product concentration change by positive elapsed time without fitting enzyme kinetics.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          productConcentrationChange: { type: "number" },
          elapsedTime: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["productConcentrationChange", "elapsedTime"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { averageConcentrationRate: { type: "number" } },
        required: ["averageConcentrationRate"],
      },
      ports: {
        inputs: [
          {
            id: "productConcentrationChange",
            label: "Product Concentration Change",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elapsedTime",
            label: "Elapsed Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "averageConcentrationRate",
            label: "Average Concentration Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = enzymeProductConcentrationRatePointTool.execute;
export default enzymeProductConcentrationRatePointTool;
