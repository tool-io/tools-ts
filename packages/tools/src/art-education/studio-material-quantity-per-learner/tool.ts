import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalQuantity: number;
  readonly reservedQuantity: number;
  readonly learners: number;
};
export type Output = {
  readonly availableQuantity: number;
  readonly perLearner: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalQuantity: { type: "number", minimum: 0 },
    reservedQuantity: { type: "number", minimum: 0 },
    learners: { type: "integer", minimum: 0 },
  },
  required: ["totalQuantity", "reservedQuantity", "learners"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableQuantity: { type: "number" },
    perLearner: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["availableQuantity", "perLearner", "defined"],
} as const;
/** Calculate studio material quantity per learner from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalQuantity, reservedQuantity, learners } = request;
  const compute = (): Output => {
    H.integer(learners, 0);
    H.domain(
      totalQuantity >= 0 &&
        reservedQuantity >= 0 &&
        reservedQuantity <= totalQuantity,
    );
    return {
      availableQuantity: totalQuantity - reservedQuantity,
      perLearner:
        learners > 0 ? (totalQuantity - reservedQuantity) / learners : 0,
      defined: learners > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalQuantity: 100, reservedQuantity: 20, learners: 10 },
  output: { availableQuantity: 80, perLearner: 8, defined: true },
} satisfies ToolExample<Input, Output>;
export const studioMaterialQuantityPerLearnerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-education/studio-material-quantity-per-learner",
    title: "Studio Material Quantity Per Learner Tool",
    description:
      "Calculate studio material quantity per learner from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalQuantity: { type: "number", minimum: 0 },
        reservedQuantity: { type: "number", minimum: 0 },
        learners: { type: "integer", minimum: 0 },
      },
      required: ["totalQuantity", "reservedQuantity", "learners"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableQuantity: { type: "number" },
        perLearner: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["availableQuantity", "perLearner", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "totalQuantity",
          label: "Total Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservedQuantity",
          label: "Reserved Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "learners",
          label: "Learners",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "availableQuantity",
          label: "Available Quantity",
          valueType: { type: "number" },
        },
        {
          id: "perLearner",
          label: "Per Learner",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = studioMaterialQuantityPerLearnerTool.execute;
export default studioMaterialQuantityPerLearnerTool;
