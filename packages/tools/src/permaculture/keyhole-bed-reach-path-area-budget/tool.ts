import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outerRadius: number;
  readonly centerRadius: number;
  readonly pathWidth: number;
  readonly pathLength: number;
  readonly overlapArea: number;
};
export type Output = { readonly growingArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outerRadius: { type: "number" },
    centerRadius: { type: "number", minimum: 0 },
    pathWidth: { type: "number", minimum: 0 },
    pathLength: { type: "number", minimum: 0 },
    overlapArea: { type: "number", minimum: 0 },
  },
  required: [
    "outerRadius",
    "centerRadius",
    "pathWidth",
    "pathLength",
    "overlapArea",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { growingArea: { type: "number" } },
  required: ["growingArea"],
} as const;
/** Calculate keyhole bed reach path area budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outerRadius, centerRadius, pathWidth, pathLength, overlapArea } =
    request;
  const compute = (): Output => {
    H.domain(
      outerRadius >= centerRadius &&
        centerRadius >= 0 &&
        pathWidth >= 0 &&
        pathLength >= 0 &&
        overlapArea >= 0 &&
        overlapArea <= pathWidth * pathLength,
    );
    return {
      growingArea:
        Math.PI * (outerRadius ** 2 - centerRadius ** 2) -
        pathWidth * pathLength +
        overlapArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    outerRadius: 2,
    centerRadius: 0.5,
    pathWidth: 0.5,
    pathLength: 1,
    overlapArea: 0,
  },
  output: { growingArea: 11.280972450961723 },
} satisfies ToolExample<Input, Output>;
export const keyholeBedReachPathAreaBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/keyhole-bed-reach-path-area-budget",
    title: "Keyhole BED Reach Path Area Budget Tool",
    description:
      "Calculate keyhole bed reach path area budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outerRadius: { type: "number" },
        centerRadius: { type: "number", minimum: 0 },
        pathWidth: { type: "number", minimum: 0 },
        pathLength: { type: "number", minimum: 0 },
        overlapArea: { type: "number", minimum: 0 },
      },
      required: [
        "outerRadius",
        "centerRadius",
        "pathWidth",
        "pathLength",
        "overlapArea",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { growingArea: { type: "number" } },
      required: ["growingArea"],
    },
    ports: {
      inputs: [
        {
          id: "outerRadius",
          label: "Outer Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "centerRadius",
          label: "Center Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pathWidth",
          label: "Path Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pathLength",
          label: "Path Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapArea",
          label: "Overlap Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "growingArea",
          label: "Growing Area",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = keyholeBedReachPathAreaBudgetTool.execute;
export default keyholeBedReachPathAreaBudgetTool;
