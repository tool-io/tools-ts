import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly northSteps: readonly number[];
  readonly eastSteps: readonly number[];
};
export type Output = {
  readonly northClosure: number;
  readonly eastClosure: number;
  readonly closureDistance: number;
  readonly traversedDistance: number;
  readonly relativeClosure: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    northSteps: { type: "array", maxItems: 256, items: { type: "number" } },
    eastSteps: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["northSteps", "eastSteps"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    northClosure: { type: "number" },
    eastClosure: { type: "number" },
    closureDistance: { type: "number" },
    traversedDistance: { type: "number" },
    relativeClosure: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "northClosure",
    "eastClosure",
    "closureDistance",
    "traversedDistance",
    "relativeClosure",
    "defined",
  ],
} as const;
/** Calculate survey loop closing share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { northSteps, eastSteps } = request;
  const compute = (): Output => {
    H.sameLength(northSteps, eastSteps);
    return (() => {
      const northClosure = northSteps.reduce((a, b) => a + b, 0),
        eastClosure = eastSteps.reduce((a, b) => a + b, 0),
        closureDistance = Math.hypot(northClosure, eastClosure),
        traversedDistance = northSteps.reduce(
          (s, x, i) => s + Math.hypot(x, eastSteps[i]),
          0,
        );
      return {
        northClosure,
        eastClosure,
        closureDistance,
        traversedDistance,
        relativeClosure:
          traversedDistance > 0 ? closureDistance / traversedDistance : 0,
        defined: traversedDistance > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { northSteps: [3, -3], eastSteps: [4, -4] },
  output: {
    northClosure: 0,
    eastClosure: 0,
    closureDistance: 0,
    traversedDistance: 10,
    relativeClosure: 0,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const surveyLoopClosingShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/survey-loop-closing-share",
    title: "Survey Loop Closing Share Tool",
    description:
      "Calculate survey loop closing share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        northSteps: { type: "array", maxItems: 256, items: { type: "number" } },
        eastSteps: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["northSteps", "eastSteps"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        northClosure: { type: "number" },
        eastClosure: { type: "number" },
        closureDistance: { type: "number" },
        traversedDistance: { type: "number" },
        relativeClosure: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "northClosure",
        "eastClosure",
        "closureDistance",
        "traversedDistance",
        "relativeClosure",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "northSteps",
          label: "North Steps",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "eastSteps",
          label: "East Steps",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "northClosure",
          label: "North Closure",
          valueType: { type: "number" },
        },
        {
          id: "eastClosure",
          label: "East Closure",
          valueType: { type: "number" },
        },
        {
          id: "closureDistance",
          label: "Closure Distance",
          valueType: { type: "number" },
        },
        {
          id: "traversedDistance",
          label: "Traversed Distance",
          valueType: { type: "number" },
        },
        {
          id: "relativeClosure",
          label: "Relative Closure",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = surveyLoopClosingShareTool.execute;
export default surveyLoopClosingShareTool;
