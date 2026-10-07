import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowMagnitude: number;
  readonly relationToCompartment: string;
};
export type Output = { readonly signedContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowMagnitude: { type: "number", minimum: 0 },
    relationToCompartment: {
      type: "string",
      maxLength: 8192,
      enum: ["inflow", "outflow"],
    },
  },
  required: ["flowMagnitude", "relationToCompartment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedContribution: { type: "number" } },
  required: ["signedContribution"],
} as const;
/** Apply an explicit compartment inflow-positive bookkeeping convention to a nonnegative flow magnitude. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowMagnitude, relationToCompartment } = request;
  const compute = (): Output => {
    H.domain(flowMagnitude >= 0, "flowMagnitude");
    H.domain(
      ["inflow", "outflow"].includes(relationToCompartment),
      "relationToCompartment",
    );
    return {
      signedContribution:
        relationToCompartment === "inflow" ? flowMagnitude : -flowMagnitude,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flowMagnitude: 4, relationToCompartment: "outflow" },
  output: { signedContribution: -4 },
} satisfies ToolExample<Input, Output>;
export const compartmentFlowSignCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-biology", "computational biology", "biology"],
      keywords: ["computational biology", "biology"],
    },
    id: "computational-biology/compartment-flow-sign-crosswalk",
    title: "Compartment Flow Sign Crosswalk",
    description:
      "Apply an explicit compartment inflow-positive bookkeeping convention to a nonnegative flow magnitude.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowMagnitude: { type: "number", minimum: 0 },
        relationToCompartment: {
          type: "string",
          maxLength: 8192,
          enum: ["inflow", "outflow"],
        },
      },
      required: ["flowMagnitude", "relationToCompartment"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedContribution: { type: "number" } },
      required: ["signedContribution"],
    },
    ports: {
      inputs: [
        {
          id: "flowMagnitude",
          label: "Flow Magnitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "relationToCompartment",
          label: "Relation To Compartment",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedContribution",
          label: "Signed Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = compartmentFlowSignCrosswalkTool.execute;
export default compartmentFlowSignCrosswalkTool;
