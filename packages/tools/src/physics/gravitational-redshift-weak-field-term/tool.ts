import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly potentialDifference: number;
  readonly lightSpeed: number;
};
export type Output = { readonly fractionalFrequencyShift: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    potentialDifference: { type: "number" },
    lightSpeed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["potentialDifference", "lightSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fractionalFrequencyShift: { type: "number" } },
  required: ["fractionalFrequencyShift"],
} as const;
/** Return only the weak-field received-minus-emitted frequency fraction -deltaPhi/c²; validity requires a small potential ratio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { potentialDifference, lightSpeed } = request;
  const compute = (): Output => {
    H.positive(lightSpeed);
    return {
      fractionalFrequencyShift:
        -potentialDifference / (lightSpeed * lightSpeed),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { potentialDifference: 100, lightSpeed: 299792458 },
  output: { fractionalFrequencyShift: -1.1126500560536184e-15 },
} satisfies ToolExample<Input, Output>;
export const gravitationalRedshiftWeakFieldTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/gravitational-redshift-weak-field-term",
    title: "Gravitational Redshift Weak Field Term Tool",
    description:
      "Return only the weak-field received-minus-emitted frequency fraction -deltaPhi/c²; validity requires a small potential ratio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        potentialDifference: { type: "number" },
        lightSpeed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["potentialDifference", "lightSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fractionalFrequencyShift: { type: "number" } },
      required: ["fractionalFrequencyShift"],
    },
    ports: {
      inputs: [
        {
          id: "potentialDifference",
          label: "Potential Difference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lightSpeed",
          label: "Light Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fractionalFrequencyShift",
          label: "Fractional Frequency Shift",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gravitationalRedshiftWeakFieldTermTool.execute;
export default gravitationalRedshiftWeakFieldTermTool;
