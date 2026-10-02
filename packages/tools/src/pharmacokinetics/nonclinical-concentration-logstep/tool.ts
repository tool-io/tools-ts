import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstConcentration: number;
  readonly secondConcentration: number;
  readonly elapsed: number;
};
export type Output = { readonly logChange: number; readonly logSlope: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstConcentration: { type: "number", exclusiveMinimum: 0 },
    secondConcentration: { type: "number", exclusiveMinimum: 0 },
    elapsed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstConcentration", "secondConcentration", "elapsed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logChange: { type: "number" }, logSlope: { type: "number" } },
  required: ["logChange", "logSlope"],
} as const;
/** Compare explicitly supplied nonclinical concentration observations without dosing or extrapolated patient predictions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstConcentration, secondConcentration, elapsed } = request;
  const compute = (): Output => {
    H.positive(firstConcentration);
    H.positive(secondConcentration);
    H.positive(elapsed);
    return {
      logChange: Math.log(secondConcentration) - Math.log(firstConcentration),
      logSlope:
        (Math.log(secondConcentration) - Math.log(firstConcentration)) /
        elapsed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstConcentration: 2, secondConcentration: 1, elapsed: 2 },
  output: { logChange: -0.6931471805599453, logSlope: -0.34657359027997264 },
} satisfies ToolExample<Input, Output>;
export const nonclinicalConcentrationLogstepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacokinetics/nonclinical-concentration-logstep",
    title: "Nonclinical Concentration Logstep Tool",
    description:
      "Compare explicitly supplied nonclinical concentration observations without dosing or extrapolated patient predictions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstConcentration: { type: "number", exclusiveMinimum: 0 },
        secondConcentration: { type: "number", exclusiveMinimum: 0 },
        elapsed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstConcentration", "secondConcentration", "elapsed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logChange: { type: "number" },
        logSlope: { type: "number" },
      },
      required: ["logChange", "logSlope"],
    },
    ports: {
      inputs: [
        {
          id: "firstConcentration",
          label: "First Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondConcentration",
          label: "Second Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logChange", label: "Log Change", valueType: { type: "number" } },
        { id: "logSlope", label: "Log Slope", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = nonclinicalConcentrationLogstepTool.execute;
export default nonclinicalConcentrationLogstepTool;
