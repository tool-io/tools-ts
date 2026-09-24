import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probability: number;
  readonly classes: number;
  readonly trueClass: boolean;
  readonly smoothing: number;
};
export type Output = { readonly target: number; readonly lossTerm: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    classes: { type: "integer", minimum: 2 },
    trueClass: { type: "boolean" },
    smoothing: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["probability", "classes", "trueClass", "smoothing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { target: { type: "number" }, lossTerm: { type: "number" } },
  required: ["target", "lossTerm"],
} as const;
/** Calculate multiclass cross entropy smoothing term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, classes, trueClass, smoothing } = request;
  const compute = (): Output => {
    H.domain(probability > 0 && probability <= 1);
    H.integer(classes, 2);
    H.probability(smoothing);
    const target = (trueClass ? 1 - smoothing : 0) + smoothing / classes;
    return { target, lossTerm: -target * Math.log(probability) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.5, classes: 4, trueClass: true, smoothing: 0.2 },
  output: { target: 0.8500000000000001, lossTerm: 0.5891751034759536 },
} satisfies ToolExample<Input, Output>;
export const multiclassCrossEntropySmoothingTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "classification/multiclass-cross-entropy-smoothing-term",
      title: "Multiclass Cross Entropy Smoothing Term Tool",
      description:
        "Calculate multiclass cross entropy smoothing term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          probability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          classes: { type: "integer", minimum: 2 },
          trueClass: { type: "boolean" },
          smoothing: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["probability", "classes", "trueClass", "smoothing"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          target: { type: "number" },
          lossTerm: { type: "number" },
        },
        required: ["target", "lossTerm"],
      },
      ports: {
        inputs: [
          {
            id: "probability",
            label: "Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "classes",
            label: "Classes",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "trueClass",
            label: "True Class",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "smoothing",
            label: "Smoothing",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "target", label: "Target", valueType: { type: "number" } },
          { id: "lossTerm", label: "Loss Term", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = multiclassCrossEntropySmoothingTermTool.execute;
export default multiclassCrossEntropySmoothingTermTool;
