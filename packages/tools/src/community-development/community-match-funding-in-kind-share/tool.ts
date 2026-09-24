import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inKind: number;
  readonly eligibleResources: number;
  readonly inKindUnit: string;
  readonly resourcesUnit: string;
};
export type Output = { readonly share: number; readonly defined: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inKind: { type: "number", minimum: 0 },
    eligibleResources: { type: "number", minimum: 0 },
    inKindUnit: { type: "string", maxLength: 8192 },
    resourcesUnit: { type: "string", maxLength: 8192 },
  },
  required: ["inKind", "eligibleResources", "inKindUnit", "resourcesUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, defined: { type: "boolean" } },
  required: ["share", "defined"],
} as const;
/** Divide an explicitly valued in-kind contribution by eligible matched resources with an identical declared unit basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inKind, eligibleResources, inKindUnit, resourcesUnit } = request;
  const compute = (): Output => {
    H.domain(
      eligibleResources >= 0 &&
        inKind >= 0 &&
        inKind <= eligibleResources &&
        inKindUnit.length > 0 &&
        inKindUnit === resourcesUnit,
    );
    return {
      share: eligibleResources > 0 ? inKind / eligibleResources : 0,
      defined: eligibleResources > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inKind: 20,
    eligibleResources: 100,
    inKindUnit: "USD-valued",
    resourcesUnit: "USD-valued",
  },
  output: { share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const communityMatchFundingInKindShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "community-development/community-match-funding-in-kind-share",
    title: "Community Match Funding In Kind Share Tool",
    description:
      "Divide an explicitly valued in-kind contribution by eligible matched resources with an identical declared unit basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inKind: { type: "number", minimum: 0 },
        eligibleResources: { type: "number", minimum: 0 },
        inKindUnit: { type: "string", maxLength: 8192 },
        resourcesUnit: { type: "string", maxLength: 8192 },
      },
      required: ["inKind", "eligibleResources", "inKindUnit", "resourcesUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, defined: { type: "boolean" } },
      required: ["share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "inKind",
          label: "In Kind",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleResources",
          label: "Eligible Resources",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inKindUnit",
          label: "In Kind Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "resourcesUnit",
          label: "Resources Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = communityMatchFundingInKindShareTool.execute;
export default communityMatchFundingInKindShareTool;
