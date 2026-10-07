import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reactionId: string;
  readonly concentrationReference: string;
  readonly pressureReference: string;
  readonly temperatureKelvin: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reactionId: { type: "string", maxLength: 8192, minLength: 1 },
    concentrationReference: { type: "string", maxLength: 8192, minLength: 1 },
    pressureReference: { type: "string", maxLength: 8192, minLength: 1 },
    temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "reactionId",
    "concentrationReference",
    "pressureReference",
    "temperatureKelvin",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly supplied thermodynamic reference conditions without selecting a standard state or computing a reaction equilibrium. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    reactionId,
    concentrationReference,
    pressureReference,
    temperatureKelvin,
  } = request;
  const compute = (): Output => {
    H.domain(
      reactionId.length > 0 &&
        concentrationReference.length > 0 &&
        pressureReference.length > 0,
      "reactionId",
    );
    (H.domain(temperatureKelvin > 0, "temperatureKelvin"), temperatureKelvin);
    return {
      label:
        reactionId +
        "; c°=" +
        concentrationReference +
        "; p°=" +
        pressureReference +
        "; T=" +
        temperatureKelvin +
        " K",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reactionId: "R17",
    concentrationReference: "1 mol/L",
    pressureReference: "1 bar",
    temperatureKelvin: 298.15,
  },
  output: { label: "R17; c°=1 mol/L; p°=1 bar; T=298.15 K" },
} satisfies ToolExample<Input, Output>;
export const reactionStandardStateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/reaction-standard-state-label",
    title: "Reaction Standard State Label",
    description:
      "Label explicitly supplied thermodynamic reference conditions without selecting a standard state or computing a reaction equilibrium.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reactionId: { type: "string", maxLength: 8192, minLength: 1 },
        concentrationReference: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        pressureReference: { type: "string", maxLength: 8192, minLength: 1 },
        temperatureKelvin: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "reactionId",
        "concentrationReference",
        "pressureReference",
        "temperatureKelvin",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "reactionId",
          label: "Reaction Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "concentrationReference",
          label: "Concentration Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "pressureReference",
          label: "Pressure Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "temperatureKelvin",
          label: "Temperature Kelvin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = reactionStandardStateLabelTool.execute;
export default reactionStandardStateLabelTool;
