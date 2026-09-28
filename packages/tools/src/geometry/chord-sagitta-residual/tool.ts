import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly chordLength: number;
  readonly measuredSagitta: number;
};
export type Output = {
  readonly expectedSagitta: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", exclusiveMinimum: 0 },
    chordLength: { type: "number", minimum: 0 },
    measuredSagitta: { type: "number" },
  },
  required: ["radius", "chordLength", "measuredSagitta"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedSagitta: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedSagitta", "residual"],
} as const;
/** Compare supplied minor-segment sagitta to a circular chord using a cancellation-resistant expression. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, chordLength, measuredSagitta } = request;
  const compute = (): Output => {
    H.positive(radius);
    H.domain(chordLength >= 0 && chordLength <= 2 * radius);
    return {
      expectedSagitta:
        (chordLength / 2) ** 2 /
        (radius +
          Math.sqrt((radius - chordLength / 2) * (radius + chordLength / 2))),
      residual:
        measuredSagitta -
        (chordLength / 2) ** 2 /
          (radius +
            Math.sqrt((radius - chordLength / 2) * (radius + chordLength / 2))),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 5, chordLength: 8, measuredSagitta: 3 },
  output: { expectedSagitta: 2, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const chordSagittaResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geometry/chord-sagitta-residual",
    title: "Chord Sagitta Residual Tool",
    description:
      "Compare supplied minor-segment sagitta to a circular chord using a cancellation-resistant expression.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", exclusiveMinimum: 0 },
        chordLength: { type: "number", minimum: 0 },
        measuredSagitta: { type: "number" },
      },
      required: ["radius", "chordLength", "measuredSagitta"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedSagitta: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedSagitta", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chordLength",
          label: "Chord Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredSagitta",
          label: "Measured Sagitta",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedSagitta",
          label: "Expected Sagitta",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = chordSagittaResidualTool.execute;
export default chordSagittaResidualTool;
