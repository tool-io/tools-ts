import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type HaberBoschEquilibriumInput = {
  readonly ammoniaConcentrationMolPerL: number;
  readonly hydrogenConcentrationMolPerL: number;
  readonly nitrogenConcentrationMolPerL: number;
};

export type HaberBoschEquilibriumOutput = {
  readonly equilibriumConstant: number;
};

export const haberBoschEquilibriumExample = {
  input: {
    ammoniaConcentrationMolPerL: 2,
    hydrogenConcentrationMolPerL: 3,
    nitrogenConcentrationMolPerL: 1,
  },
  output: { equilibriumConstant: 4 / 27 },
} satisfies ToolExample<
  HaberBoschEquilibriumInput,
  HaberBoschEquilibriumOutput
>;

export const haberBoschEquilibriumInputSchema = {
  additionalProperties: false,
  properties: {
    ammoniaConcentrationMolPerL: {
      description: "Ammonia concentration in mol/L.",
      exclusiveMinimum: 0,
      type: "number",
    },
    hydrogenConcentrationMolPerL: {
      description: "Hydrogen concentration in mol/L.",
      exclusiveMinimum: 0,
      type: "number",
    },
    nitrogenConcentrationMolPerL: {
      description: "Nitrogen concentration in mol/L.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: [
    "ammoniaConcentrationMolPerL",
    "hydrogenConcentrationMolPerL",
    "nitrogenConcentrationMolPerL",
  ],
  type: "object",
} as const;

export const haberBoschEquilibriumOutputSchema = {
  additionalProperties: false,
  properties: {
    equilibriumConstant: {
      description:
        "Concentration equilibrium constant Kc for N2 + 3 H2 ⇌ 2 NH3.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["equilibriumConstant"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const positiveFiniteIssue = (
  field:
    | "ammoniaConcentrationMolPerL"
    | "hydrogenConcentrationMolPerL"
    | "nitrogenConcentrationMolPerL",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

export const calculateHaberBoschEquilibrium = (
  input: unknown,
): ToolResult<HaberBoschEquilibriumOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue(
      "ammoniaConcentrationMolPerL",
      input.ammoniaConcentrationMolPerL,
    ),
    positiveFiniteIssue(
      "hydrogenConcentrationMolPerL",
      input.hydrogenConcentrationMolPerL,
    ),
    positiveFiniteIssue(
      "nitrogenConcentrationMolPerL",
      input.nitrogenConcentrationMolPerL,
    ),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "ammoniaConcentrationMolPerL" &&
          field !== "hydrogenConcentrationMolPerL" &&
          field !== "nitrogenConcentrationMolPerL",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const equilibriumConstant =
    (input.ammoniaConcentrationMolPerL as number) ** 2 /
    ((input.nitrogenConcentrationMolPerL as number) *
      (input.hydrogenConcentrationMolPerL as number) ** 3);
  if (!Number.isFinite(equilibriumConstant) || equilibriumConstant <= 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "equilibriumConstant",
        message:
          "Equilibrium constant could not be calculated as a finite positive number.",
      },
    ]);

  return toolSuccess({ equilibriumConstant });
};

export const haberBoschEquilibriumTool = defineTool<
  HaberBoschEquilibriumInput,
  HaberBoschEquilibriumOutput
>({
  contractVersion: 1,
  description:
    "Calculate the concentration equilibrium constant for N2 + 3 H2 ⇌ 2 NH3.",
  discovery: {
    aliases: ["Haber-Bosch equilibrium constant", "ammonia synthesis Kc"],
    collections: ["chemistry", "industrial chemistry"],
    fields: [
      "chemical equilibrium",
      "ammonia synthesis",
      "equilibrium constant",
    ],
    keywords: ["Haber-Bosch", "N2", "H2", "NH3", "Kc"],
  },
  execute: calculateHaberBoschEquilibrium,
  execution: { kind: "pure" },
  id: "chemistry/industrial-haber-bosch-equilibrium",
  inputSchema: haberBoschEquilibriumInputSchema,
  outputSchema: haberBoschEquilibriumOutputSchema,
  ports: {
    inputs: [
      {
        id: "ammoniaConcentrationMolPerL",
        label: "Ammonia concentration",
        required: true,
        valueType: {
          format: "molar-concentration",
          type: "number",
          unit: "mol/L",
        },
      },
      {
        id: "hydrogenConcentrationMolPerL",
        label: "Hydrogen concentration",
        required: true,
        valueType: {
          format: "molar-concentration",
          type: "number",
          unit: "mol/L",
        },
      },
      {
        id: "nitrogenConcentrationMolPerL",
        label: "Nitrogen concentration",
        required: true,
        valueType: {
          format: "molar-concentration",
          type: "number",
          unit: "mol/L",
        },
      },
    ],
    outputs: [
      {
        id: "equilibriumConstant",
        label: "Equilibrium constant",
        valueType: {
          format: "equilibrium-constant",
          type: "number",
          unit: "(mol/L)^-2",
        },
      },
    ],
  },
  title: "Haber-Bosch Equilibrium Calculator",
});

export default haberBoschEquilibriumTool;
