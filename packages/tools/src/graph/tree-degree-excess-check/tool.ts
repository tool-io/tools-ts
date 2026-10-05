import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly degrees: readonly number[] };
export type Output = {
  readonly degreeSum: number;
  readonly requiredDegreeSum: number;
  readonly residual: number;
  readonly necessaryCondition: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degrees: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["degrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degreeSum: { type: "integer" },
    requiredDegreeSum: { type: "integer" },
    residual: { type: "integer" },
    necessaryCondition: { type: "boolean" },
  },
  required: [
    "degreeSum",
    "requiredDegreeSum",
    "residual",
    "necessaryCondition",
  ],
} as const;
/** Check the positive-degree and degree-sum conditions for a labeled simple-tree degree sequence; this does not inspect a particular graph's connectivity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { degrees } = request;
  const compute = (): Output => {
    H.domain(degrees.length > 0, "degrees");
    degrees.forEach((v) => H.integer(v, 0, degrees.length - 1));
    const degreeSum = degrees.reduce((a, b) => a + b, 0),
      requiredDegreeSum = 2 * (degrees.length - 1);
    return {
      degreeSum,
      requiredDegreeSum,
      residual: degreeSum - requiredDegreeSum,
      necessaryCondition:
        degreeSum === requiredDegreeSum &&
        (degrees.length === 1 || degrees.every((v) => v > 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { degrees: [1, 3, 1, 1] },
  output: {
    degreeSum: 6,
    requiredDegreeSum: 6,
    residual: 0,
    necessaryCondition: true,
  },
} satisfies ToolExample<Input, Output>;
export const treeDegreeExcessCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graph/tree-degree-excess-check",
    title: "Tree Degree Excess Check Tool",
    description:
      "Check the positive-degree and degree-sum conditions for a labeled simple-tree degree sequence; this does not inspect a particular graph's connectivity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degrees: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["degrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degreeSum: { type: "integer" },
        requiredDegreeSum: { type: "integer" },
        residual: { type: "integer" },
        necessaryCondition: { type: "boolean" },
      },
      required: [
        "degreeSum",
        "requiredDegreeSum",
        "residual",
        "necessaryCondition",
      ],
    },
    ports: {
      inputs: [
        {
          id: "degrees",
          label: "Degrees",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "degreeSum",
          label: "Degree Sum",
          valueType: { type: "integer" },
        },
        {
          id: "requiredDegreeSum",
          label: "Required Degree Sum",
          valueType: { type: "integer" },
        },
        { id: "residual", label: "Residual", valueType: { type: "integer" } },
        {
          id: "necessaryCondition",
          label: "Necessary Condition",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeDegreeExcessCheckTool.execute;
export default treeDegreeExcessCheckTool;
