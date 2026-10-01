import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ingredientMasses: readonly number[];
  readonly identityReported: readonly boolean[];
  readonly amountReported: readonly boolean[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly totalMass: number;
  readonly supportedMass: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ingredientMasses: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    identityReported: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    amountReported: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "ingredientMasses",
    "identityReported",
    "amountReported",
    "sourceVerified",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMass: { type: "number" },
    supportedMass: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["totalMass", "supportedMass", "share", "defined"],
} as const;
/** Calculate study ingredient support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ingredientMasses, identityReported, amountReported, sourceVerified } =
    request;
  const compute = (): Output => {
    H.sameLength(ingredientMasses, identityReported);
    H.sameLength(ingredientMasses, amountReported);
    H.sameLength(ingredientMasses, sourceVerified);
    H.domain(ingredientMasses.every((x) => x >= 0));
    return (() => {
      const totalMass = ingredientMasses.reduce((a, b) => a + b, 0),
        supportedMass = ingredientMasses.reduce(
          (s, x, i) =>
            s +
            (identityReported[i] && amountReported[i] && sourceVerified[i]
              ? x
              : 0),
          0,
        );
      return {
        totalMass,
        supportedMass,
        share: totalMass > 0 ? supportedMass / totalMass : 0,
        defined: totalMass > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ingredientMasses: [2, 3, 5],
    identityReported: [true, true, true],
    amountReported: [true, true, false],
    sourceVerified: [true, false, true],
  },
  output: { totalMass: 10, supportedMass: 2, share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const studyIngredientSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "naturopathy/study-ingredient-support-share",
    title: "Study Ingredient Support Share Tool",
    description:
      "Calculate study ingredient support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ingredientMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        identityReported: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        amountReported: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "ingredientMasses",
        "identityReported",
        "amountReported",
        "sourceVerified",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMass: { type: "number" },
        supportedMass: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["totalMass", "supportedMass", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "ingredientMasses",
          label: "Ingredient Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "identityReported",
          label: "Identity Reported",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "amountReported",
          label: "Amount Reported",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "totalMass", label: "Total Mass", valueType: { type: "number" } },
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
export const run = studyIngredientSupportShareTool.execute;
export default studyIngredientSupportShareTool;
