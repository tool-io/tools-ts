import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossMass: number;
  readonly packagingMass: number;
  readonly servingMass: number;
  readonly declaredServings: number;
};
export type Output = {
  readonly netMass: number;
  readonly completeServings: number;
  readonly remainder: number;
  readonly declarationGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMass: { type: "number" },
    packagingMass: { type: "number", minimum: 0 },
    servingMass: { type: "number", exclusiveMinimum: 0 },
    declaredServings: { type: "integer", minimum: 0 },
  },
  required: ["grossMass", "packagingMass", "servingMass", "declaredServings"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number" },
    completeServings: { type: "integer" },
    remainder: { type: "number" },
    declarationGap: { type: "integer" },
  },
  required: ["netMass", "completeServings", "remainder", "declarationGap"],
} as const;
/** Audit package mass and supplied serving-size arithmetic without intake advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossMass, packagingMass, servingMass, declaredServings } = request;
  const compute = (): Output => {
    H.domain(grossMass >= packagingMass && packagingMass >= 0);
    H.positive(servingMass);
    H.integer(declaredServings, 0);
    return {
      netMass: grossMass - packagingMass,
      completeServings: Math.floor((grossMass - packagingMass) / servingMass),
      remainder: (grossMass - packagingMass) % servingMass,
      declarationGap:
        Math.floor((grossMass - packagingMass) / servingMass) -
        declaredServings,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grossMass: 120,
    packagingMass: 20,
    servingMass: 3,
    declaredServings: 30,
  },
  output: {
    netMass: 100,
    completeServings: 33,
    remainder: 1,
    declarationGap: 3,
  },
} satisfies ToolExample<Input, Output>;
export const naturopathyLabelNetmassServingCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "naturopathy/naturopathy-label-netmass-serving-count",
      title: "Naturopathy Label Netmass Serving Count Tool",
      description:
        "Audit package mass and supplied serving-size arithmetic without intake advice.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grossMass: { type: "number" },
          packagingMass: { type: "number", minimum: 0 },
          servingMass: { type: "number", exclusiveMinimum: 0 },
          declaredServings: { type: "integer", minimum: 0 },
        },
        required: [
          "grossMass",
          "packagingMass",
          "servingMass",
          "declaredServings",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netMass: { type: "number" },
          completeServings: { type: "integer" },
          remainder: { type: "number" },
          declarationGap: { type: "integer" },
        },
        required: [
          "netMass",
          "completeServings",
          "remainder",
          "declarationGap",
        ],
      },
      ports: {
        inputs: [
          {
            id: "grossMass",
            label: "Gross Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "packagingMass",
            label: "Packaging Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "servingMass",
            label: "Serving Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "declaredServings",
            label: "Declared Servings",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
          {
            id: "completeServings",
            label: "Complete Servings",
            valueType: { type: "integer" },
          },
          {
            id: "remainder",
            label: "Remainder",
            valueType: { type: "number" },
          },
          {
            id: "declarationGap",
            label: "Declaration Gap",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = naturopathyLabelNetmassServingCountTool.execute;
export default naturopathyLabelNetmassServingCountTool;
