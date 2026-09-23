import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly maximumArea: number;
  readonly minimumArea: number;
  readonly maximumUncertainty: number;
  readonly minimumUncertainty: number;
};
export type Output = {
  readonly fractionalAreaChange: number;
  readonly conservativeLower: number;
  readonly conservativeUpper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maximumArea: { type: "number", exclusiveMinimum: 0 },
    minimumArea: { type: "number", minimum: 0 },
    maximumUncertainty: { type: "number", minimum: 0 },
    minimumUncertainty: { type: "number", minimum: 0 },
  },
  required: [
    "maximumArea",
    "minimumArea",
    "maximumUncertainty",
    "minimumUncertainty",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractionalAreaChange: { type: "number" },
    conservativeLower: { type: "number" },
    conservativeUpper: { type: "number" },
  },
  required: ["fractionalAreaChange", "conservativeLower", "conservativeUpper"],
} as const;
/** Descriptive model area change with independent endpoint bounds, without a function assessment or clinical threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { maximumArea, minimumArea, maximumUncertainty, minimumUncertainty } =
    request;
  const compute = (): Output => {
    H.domain(
      maximumArea > 0 &&
        minimumArea >= 0 &&
        minimumArea <= maximumArea &&
        maximumUncertainty >= 0 &&
        maximumUncertainty < maximumArea &&
        minimumUncertainty >= 0,
    );
    return {
      fractionalAreaChange: 1 - minimumArea / maximumArea,
      conservativeLower:
        1 -
        (minimumArea + minimumUncertainty) / (maximumArea - maximumUncertainty),
      conservativeUpper:
        1 -
        Math.max(0, minimumArea - minimumUncertainty) /
          (maximumArea + maximumUncertainty),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    maximumArea: 20,
    minimumArea: 10,
    maximumUncertainty: 1,
    minimumUncertainty: 1,
  },
  output: {
    fractionalAreaChange: 0.5,
    conservativeLower: 0.42105263157894735,
    conservativeUpper: 0.5714285714285714,
  },
} satisfies ToolExample<Input, Output>;
export const cardiacResearchFractionalAreaChangeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cardiology/cardiac-research-fractional-area-change",
      title: "Cardiac Research Fractional Area Change Tool",
      description:
        "Descriptive model area change with independent endpoint bounds, without a function assessment or clinical threshold.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          maximumArea: { type: "number", exclusiveMinimum: 0 },
          minimumArea: { type: "number", minimum: 0 },
          maximumUncertainty: { type: "number", minimum: 0 },
          minimumUncertainty: { type: "number", minimum: 0 },
        },
        required: [
          "maximumArea",
          "minimumArea",
          "maximumUncertainty",
          "minimumUncertainty",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fractionalAreaChange: { type: "number" },
          conservativeLower: { type: "number" },
          conservativeUpper: { type: "number" },
        },
        required: [
          "fractionalAreaChange",
          "conservativeLower",
          "conservativeUpper",
        ],
      },
      ports: {
        inputs: [
          {
            id: "maximumArea",
            label: "Maximum Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimumArea",
            label: "Minimum Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximumUncertainty",
            label: "Maximum Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimumUncertainty",
            label: "Minimum Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fractionalAreaChange",
            label: "Fractional Area Change",
            valueType: { type: "number" },
          },
          {
            id: "conservativeLower",
            label: "Conservative Lower",
            valueType: { type: "number" },
          },
          {
            id: "conservativeUpper",
            label: "Conservative Upper",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = cardiacResearchFractionalAreaChangeTool.execute;
export default cardiacResearchFractionalAreaChangeTool;
