import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rainIntensity: number;
  readonly area: number;
  readonly coefficient: number;
  readonly unitFactor: number;
};
export type Output = { readonly flowContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rainIntensity: { type: "number", minimum: 0 },
    area: { type: "number", minimum: 0 },
    coefficient: { type: "number", minimum: 0, maximum: 1 },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rainIntensity", "area", "coefficient", "unitFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { flowContribution: { type: "number" } },
  required: ["flowContribution"],
} as const;
/** Calculate rational runoff impervious area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rainIntensity, area, coefficient, unitFactor } = request;
  const compute = (): Output => {
    H.domain(rainIntensity >= 0 && area >= 0);
    H.probability(coefficient);
    H.positive(unitFactor);
    return {
      flowContribution: rainIntensity * area * coefficient * unitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rainIntensity: 20, area: 5, coefficient: 0.8, unitFactor: 1 },
  output: { flowContribution: 80 },
} satisfies ToolExample<Input, Output>;
export const rationalRunoffImperviousAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrology/rational-runoff-impervious-area-term",
    title: "Rational Runoff Impervious Area Term Tool",
    description:
      "Calculate rational runoff impervious area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rainIntensity: { type: "number", minimum: 0 },
        area: { type: "number", minimum: 0 },
        coefficient: { type: "number", minimum: 0, maximum: 1 },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["rainIntensity", "area", "coefficient", "unitFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { flowContribution: { type: "number" } },
      required: ["flowContribution"],
    },
    ports: {
      inputs: [
        {
          id: "rainIntensity",
          label: "Rain Intensity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "flowContribution",
          label: "Flow Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rationalRunoffImperviousAreaTermTool.execute;
export default rationalRunoffImperviousAreaTermTool;
