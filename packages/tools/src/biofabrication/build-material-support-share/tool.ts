import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly materialMasses: readonly number[];
  readonly lotVerified: readonly boolean[];
  readonly sourceMatched: readonly boolean[];
  readonly quantityVerified: readonly boolean[];
};
export type Output = {
  readonly buildMass: number;
  readonly supportedMass: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    materialMasses: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    lotVerified: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sourceMatched: { type: "array", maxItems: 256, items: { type: "boolean" } },
    quantityVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "materialMasses",
    "lotVerified",
    "sourceMatched",
    "quantityVerified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    buildMass: { type: "number" },
    supportedMass: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["buildMass", "supportedMass", "share", "defined"],
} as const;
/** Calculate build material support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { materialMasses, lotVerified, sourceMatched, quantityVerified } =
    request;
  const compute = (): Output => {
    H.sameLength(materialMasses, lotVerified);
    H.sameLength(materialMasses, sourceMatched);
    H.sameLength(materialMasses, quantityVerified);
    H.domain(materialMasses.every((x) => x >= 0));
    return (() => {
      const buildMass = materialMasses.reduce((a, b) => a + b, 0),
        supportedMass = materialMasses.reduce(
          (s, x, i) =>
            s +
            (lotVerified[i] && sourceMatched[i] && quantityVerified[i] ? x : 0),
          0,
        );
      return {
        buildMass,
        supportedMass,
        share: buildMass > 0 ? supportedMass / buildMass : 0,
        defined: buildMass > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    materialMasses: [2, 3, 5],
    lotVerified: [true, true, true],
    sourceMatched: [true, true, false],
    quantityVerified: [true, false, true],
  },
  output: { buildMass: 10, supportedMass: 2, share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const buildMaterialSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/build-material-support-share",
    title: "Build Material Support Share Tool",
    description:
      "Calculate build material support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        materialMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        lotVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceMatched: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        quantityVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "materialMasses",
        "lotVerified",
        "sourceMatched",
        "quantityVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        buildMass: { type: "number" },
        supportedMass: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["buildMass", "supportedMass", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "materialMasses",
          label: "Material Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "lotVerified",
          label: "Lot Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceMatched",
          label: "Source Matched",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "quantityVerified",
          label: "Quantity Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "buildMass", label: "Build Mass", valueType: { type: "number" } },
        {
          id: "supportedMass",
          label: "Supported Mass",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = buildMaterialSupportShareTool.execute;
export default buildMaterialSupportShareTool;
