import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly inputUnit: string;
};
export type Output = {
  readonly nanogramsPerMilliliter: number;
  readonly microgramsPerMilliliter: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    inputUnit: { type: "string", maxLength: 8192, enum: ["ng/mL", "ug/mL"] },
  },
  required: ["concentration", "inputUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nanogramsPerMilliliter: { type: "number" },
    microgramsPerMilliliter: { type: "number" },
  },
  required: ["nanogramsPerMilliliter", "microgramsPerMilliliter"],
} as const;
/** Convert an explicit bioanalytical concentration between micrograms and nanograms per milliliter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, inputUnit } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0, "concentration");
    H.domain(["ng/mL", "ug/mL"].includes(inputUnit), "inputUnit");
    return {
      nanogramsPerMilliliter:
        inputUnit === "ug/mL" ? concentration * 1000 : concentration,
      microgramsPerMilliliter:
        inputUnit === "ng/mL" ? concentration / 1000 : concentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 2, inputUnit: "ug/mL" },
  output: { nanogramsPerMilliliter: 2000, microgramsPerMilliliter: 2 },
} satisfies ToolExample<Input, Output>;
export const pkBioanalyticalUnitPrefixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacokinetics", "pharmacy"],
      keywords: ["pharmacokinetics", "pharmacy"],
    },
    id: "pharmacokinetics/pk-bioanalytical-unit-prefix",
    title: "PK Bioanalytical Unit Prefix",
    description:
      "Convert an explicit bioanalytical concentration between micrograms and nanograms per milliliter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        inputUnit: {
          type: "string",
          maxLength: 8192,
          enum: ["ng/mL", "ug/mL"],
        },
      },
      required: ["concentration", "inputUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nanogramsPerMilliliter: { type: "number" },
        microgramsPerMilliliter: { type: "number" },
      },
      required: ["nanogramsPerMilliliter", "microgramsPerMilliliter"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inputUnit",
          label: "Input Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "nanogramsPerMilliliter",
          label: "Nanograms Per Milliliter",
          valueType: { type: "number" },
        },
        {
          id: "microgramsPerMilliliter",
          label: "Micrograms Per Milliliter",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pkBioanalyticalUnitPrefixTool.execute;
export default pkBioanalyticalUnitPrefixTool;
