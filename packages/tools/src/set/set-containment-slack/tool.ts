import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supersetSize: number;
  readonly subsetSize: number;
  readonly intersectionSize: number;
};
export type Output = {
  readonly missingFromSuperset: number;
  readonly supersetOnly: number;
  readonly contained: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supersetSize: { type: "integer", minimum: 0 },
    subsetSize: { type: "integer", minimum: 0 },
    intersectionSize: { type: "integer", minimum: 0 },
  },
  required: ["supersetSize", "subsetSize", "intersectionSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingFromSuperset: { type: "integer" },
    supersetOnly: { type: "integer" },
    contained: { type: "boolean" },
  },
  required: ["missingFromSuperset", "supersetOnly", "contained"],
} as const;
/** Inspect cardinality witnesses for finite-set containment without materializing elements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { supersetSize, subsetSize, intersectionSize } = request;
  const compute = (): Output => {
    H.integer(supersetSize, 0);
    H.integer(subsetSize, 0);
    H.integer(intersectionSize, 0, Math.min(supersetSize, subsetSize));
    return {
      missingFromSuperset: subsetSize - intersectionSize,
      supersetOnly: supersetSize - intersectionSize,
      contained: subsetSize === intersectionSize,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { supersetSize: 10, subsetSize: 6, intersectionSize: 5 },
  output: { missingFromSuperset: 1, supersetOnly: 5, contained: false },
} satisfies ToolExample<Input, Output>;
export const setContainmentSlackTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "set/set-containment-slack",
      title: "Set Containment Slack Tool",
      description:
        "Inspect cardinality witnesses for finite-set containment without materializing elements.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          supersetSize: { type: "integer", minimum: 0 },
          subsetSize: { type: "integer", minimum: 0 },
          intersectionSize: { type: "integer", minimum: 0 },
        },
        required: ["supersetSize", "subsetSize", "intersectionSize"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          missingFromSuperset: { type: "integer" },
          supersetOnly: { type: "integer" },
          contained: { type: "boolean" },
        },
        required: ["missingFromSuperset", "supersetOnly", "contained"],
      },
      ports: {
        inputs: [
          {
            id: "supersetSize",
            label: "Superset Size",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "subsetSize",
            label: "Subset Size",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "intersectionSize",
            label: "Intersection Size",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "missingFromSuperset",
            label: "Missing From Superset",
            valueType: { type: "integer" },
          },
          {
            id: "supersetOnly",
            label: "Superset Only",
            valueType: { type: "integer" },
          },
          {
            id: "contained",
            label: "Contained",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = setContainmentSlackTool.execute;
export default setContainmentSlackTool;
