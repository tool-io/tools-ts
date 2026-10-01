import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstForce: number;
  readonly secondForce: number;
  readonly firstDisplacement: number;
  readonly secondDisplacement: number;
};
export type Output = { readonly signedWork: number };
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
  properties: { signedWork: { type: "number" } },
  required: ["signedWork"],
} as const;
/** Return one trapezoidal signed research load-displacement work contribution, not a whole loop hysteresis measure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstForce, secondForce, firstDisplacement, secondDisplacement } =
    request;
  const compute = (): Output => {
    return {
      signedWork:
        (firstForce / 2 + secondForce / 2) *
        (secondDisplacement - firstDisplacement),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstForce: 2,
    secondForce: 4,
    firstDisplacement: 1,
    secondDisplacement: 3,
  },
  output: { signedWork: 6 },
} satisfies ToolExample<Input, Output>;
export const loadDisplacementLoopStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/load-displacement-loop-step",
    title: "Load Displacement Loop Step Tool",
    description:
      "Return one trapezoidal signed research load-displacement work contribution, not a whole loop hysteresis measure.",
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
      properties: { signedWork: { type: "number" } },
      required: ["signedWork"],
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
      ],
    },
  },
  calculate,
});
export const run = loadDisplacementLoopStepTool.execute;
export default loadDisplacementLoopStepTool;
