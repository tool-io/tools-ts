import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly energyCharge: number;
  readonly networkCharge: number;
  readonly standingCharge: number;
  readonly taxNetwork: boolean;
  readonly taxStanding: boolean;
};
export type Output = {
  readonly taxableBase: number;
  readonly includedComponents: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energyCharge: { type: "number", minimum: 0 },
    networkCharge: { type: "number", minimum: 0 },
    standingCharge: { type: "number", minimum: 0 },
    taxNetwork: { type: "boolean" },
    taxStanding: { type: "boolean" },
  },
  required: [
    "energyCharge",
    "networkCharge",
    "standingCharge",
    "taxNetwork",
    "taxStanding",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxableBase: { type: "number" },
    includedComponents: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["taxableBase", "includedComponents"],
} as const;
/** Compose an energy bill’s explicit component tax base from caller-supplied inclusion flags without selecting a jurisdictional tax rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    energyCharge,
    networkCharge,
    standingCharge,
    taxNetwork,
    taxStanding,
  } = request;
  const compute = (): Output => {
    H.domain(
      energyCharge >= 0 && networkCharge >= 0 && standingCharge >= 0,
      "energyCharge",
    );
    return {
      taxableBase:
        energyCharge +
        (taxNetwork ? networkCharge : 0) +
        (taxStanding ? standingCharge : 0),
      includedComponents: [
        "energy",
        ...(taxNetwork ? ["network"] : []),
        ...(taxStanding ? ["standing"] : []),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    energyCharge: 100,
    networkCharge: 20,
    standingCharge: 10,
    taxNetwork: true,
    taxStanding: false,
  },
  output: { taxableBase: 120, includedComponents: ["energy", "network"] },
} satisfies ToolExample<Input, Output>;
export const energyBillTaxBaseLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["energy-economics", "energy economics", "economics"],
      keywords: ["energy economics", "economics"],
    },
    id: "energy-economics/energy-bill-tax-base-label",
    title: "Energy Bill Tax Base Label",
    description:
      "Compose an energy bill’s explicit component tax base from caller-supplied inclusion flags without selecting a jurisdictional tax rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energyCharge: { type: "number", minimum: 0 },
        networkCharge: { type: "number", minimum: 0 },
        standingCharge: { type: "number", minimum: 0 },
        taxNetwork: { type: "boolean" },
        taxStanding: { type: "boolean" },
      },
      required: [
        "energyCharge",
        "networkCharge",
        "standingCharge",
        "taxNetwork",
        "taxStanding",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxableBase: { type: "number" },
        includedComponents: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["taxableBase", "includedComponents"],
    },
    ports: {
      inputs: [
        {
          id: "energyCharge",
          label: "Energy Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "networkCharge",
          label: "Network Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "standingCharge",
          label: "Standing Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxNetwork",
          label: "Tax Network",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "taxStanding",
          label: "Tax Standing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "taxableBase",
          label: "Taxable Base",
          valueType: { type: "number" },
        },
        {
          id: "includedComponents",
          label: "Included Components",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = energyBillTaxBaseLabelTool.execute;
export default energyBillTaxBaseLabelTool;
