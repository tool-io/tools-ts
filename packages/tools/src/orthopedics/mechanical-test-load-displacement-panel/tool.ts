import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstForce: number;
  readonly secondForce: number;
  readonly firstDisplacement: number;
  readonly secondDisplacement: number;
};
export type Output = {
  readonly signedWork: number;
  readonly displacementIncrement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstForce: { type: "number" },
    secondForce: { type: "number" },
    firstDisplacement: { type: "number" },
    secondDisplacement: { type: "number" },
  },
  required: [
    "firstForce",
    "secondForce",
    "firstDisplacement",
    "secondDisplacement",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedWork: { type: "number" },
    displacementIncrement: { type: "number" },
  },
  required: ["signedWork", "displacementIncrement"],
} as const;
/** One signed trapezoid of a supplied bench load-displacement trace, without constitutive fitting or strength classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstForce, secondForce, firstDisplacement, secondDisplacement } =
    request;
  const compute = (): Output => {
    return {
      signedWork:
        ((firstForce + secondForce) *
          (secondDisplacement - firstDisplacement)) /
        2,
      displacementIncrement: secondDisplacement - firstDisplacement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstForce: 10,
    secondForce: 30,
    firstDisplacement: 0,
    secondDisplacement: 2,
  },
  output: { signedWork: 40, displacementIncrement: 2 },
} satisfies ToolExample<Input, Output>;
export const mechanicalTestLoadDisplacementPanelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "orthopedics/mechanical-test-load-displacement-panel",
      title: "Mechanical Test Load Displacement Panel Tool",
      description:
        "One signed trapezoid of a supplied bench load-displacement trace, without constitutive fitting or strength classification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstForce: { type: "number" },
          secondForce: { type: "number" },
          firstDisplacement: { type: "number" },
          secondDisplacement: { type: "number" },
        },
        required: [
          "firstForce",
          "secondForce",
          "firstDisplacement",
          "secondDisplacement",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedWork: { type: "number" },
          displacementIncrement: { type: "number" },
        },
        required: ["signedWork", "displacementIncrement"],
      },
      ports: {
        inputs: [
          {
            id: "firstForce",
            label: "First Force",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondForce",
            label: "Second Force",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstDisplacement",
            label: "First Displacement",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondDisplacement",
            label: "Second Displacement",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedWork",
            label: "Signed Work",
            valueType: { type: "number" },
          },
          {
            id: "displacementIncrement",
            label: "Displacement Increment",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = mechanicalTestLoadDisplacementPanelTool.execute;
export default mechanicalTestLoadDisplacementPanelTool;
