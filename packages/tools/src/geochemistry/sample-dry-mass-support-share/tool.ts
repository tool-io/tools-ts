import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMasses: readonly number[];
  readonly moistureFractions: readonly number[];
  readonly supported: readonly boolean[];
};
export type Output = {
  readonly dryMass: number;
  readonly supportedDryMass: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMasses: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    moistureFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["wetMasses", "moistureFractions", "supported"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    supportedDryMass: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["dryMass", "supportedDryMass", "share", "defined"],
} as const;
/** Calculate sample dry mass support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMasses, moistureFractions, supported } = request;
  const compute = (): Output => {
    H.sameLength(wetMasses, moistureFractions);
    H.sameLength(wetMasses, supported);
    H.domain(
      wetMasses.every((x) => x >= 0) &&
        moistureFractions.every((x) => x >= 0 && x <= 1),
    );
    return (() => {
      const dryMass = wetMasses.reduce(
          (s, x, i) => s + x * (1 - moistureFractions[i]),
          0,
        ),
        supportedDryMass = wetMasses.reduce(
          (s, x, i) => s + (supported[i] ? x * (1 - moistureFractions[i]) : 0),
          0,
        );
      return {
        dryMass,
        supportedDryMass,
        share: dryMass > 0 ? supportedDryMass / dryMass : 0,
        defined: dryMass > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wetMasses: [10, 20],
    moistureFractions: [0.2, 0.5],
    supported: [true, false],
  },
  output: {
    dryMass: 18,
    supportedDryMass: 8,
    share: 0.4444444444444444,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const sampleDryMassSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/sample-dry-mass-support-share",
    title: "Sample Dry Mass Support Share Tool",
    description:
      "Calculate sample dry mass support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        moistureFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["wetMasses", "moistureFractions", "supported"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        supportedDryMass: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["dryMass", "supportedDryMass", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "wetMasses",
          label: "Wet Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "moistureFractions",
          label: "Moisture Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "supported",
          label: "Supported",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        {
          id: "supportedDryMass",
          label: "Supported Dry Mass",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = sampleDryMassSupportShareTool.execute;
export default sampleDryMassSupportShareTool;
