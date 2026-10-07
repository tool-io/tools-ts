import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly angularMomentum: number };
export type Output = {
  readonly shellLabel: string;
  readonly degeneracy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { angularMomentum: { type: "integer", minimum: 0 } },
  required: ["angularMomentum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shellLabel: { type: "string", maxLength: 8192 },
    degeneracy: { type: "integer" },
  },
  required: ["shellLabel", "degeneracy"],
} as const;
/** Label supplied angular momentum l using s through g or explicit l=n and report the 2l+1 spherical-function count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angularMomentum } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(angularMomentum) &&
        angularMomentum >= 0 &&
        angularMomentum <= Number.MAX_SAFE_INTEGER,
      "angularMomentum",
    ),
      angularMomentum);
    return {
      shellLabel:
        angularMomentum <= 4
          ? ["s", "p", "d", "f", "g"][angularMomentum]
          : "l=" + angularMomentum,
      degeneracy: Number(2n * BigInt(angularMomentum) + 1n),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { angularMomentum: 2 },
  output: { shellLabel: "d", degeneracy: 5 },
} satisfies ToolExample<Input, Output>;
export const singleCenterAngularMomentumLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "computational-chemistry",
        "computational chemistry",
        "chemistry",
      ],
      keywords: ["computational chemistry", "chemistry"],
    },
    id: "computational-chemistry/single-center-angular-momentum-label",
    title: "Single Center Angular Momentum Label",
    description:
      "Label supplied angular momentum l using s through g or explicit l=n and report the 2l+1 spherical-function count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { angularMomentum: { type: "integer", minimum: 0 } },
      required: ["angularMomentum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shellLabel: { type: "string", maxLength: 8192 },
        degeneracy: { type: "integer" },
      },
      required: ["shellLabel", "degeneracy"],
    },
    ports: {
      inputs: [
        {
          id: "angularMomentum",
          label: "Angular Momentum",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "shellLabel",
          label: "Shell Label",
          valueType: { type: "string" },
        },
        {
          id: "degeneracy",
          label: "Degeneracy",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = singleCenterAngularMomentumLabelTool.execute;
export default singleCenterAngularMomentumLabelTool;
