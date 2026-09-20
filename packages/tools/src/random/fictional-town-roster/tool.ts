import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import {
  fcArray,
  fcBoolean,
  fcCounts,
  fcCountSchema,
  fcId,
  fcInput,
  fcInteger,
  fcObject,
  fcOutput,
  fcPick,
  fcRun,
  fcText,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type FictionalTownRosterInput = FcSeed & {
  readonly count: number;
  readonly names: readonly string[];
  readonly occupations: readonly string[];
  readonly roles: readonly string[];
  readonly households: readonly {
    readonly id: string;
    readonly label: string;
    readonly capacity: number;
  }[];
  readonly repeatNames: boolean;
};
export type FictionalTownRosterOutput = FcReplay & {
  readonly fictional: boolean;
  readonly residents: readonly {
    readonly id: string;
    readonly name: string;
    readonly occupation: string;
    readonly role: string;
    readonly householdId: string;
    readonly householdLabel: string;
  }[];
  readonly householdCounts: readonly {
    readonly id: string;
    readonly count: number;
  }[];
  readonly occupationCounts: readonly {
    readonly id: string;
    readonly count: number;
  }[];
};
export const inputSchema = fcInput({
  count: fcInteger(1, 128),
  names: fcArray(fcText, 128, 1),
  occupations: fcArray(fcId, 32, 1),
  roles: fcArray(fcId, 32, 1),
  households: fcArray(
    fcObject({ id: fcId, label: fcText, capacity: fcInteger(1, 128) }),
    64,
    1,
  ),
  repeatNames: fcBoolean,
});
export const outputSchema = fcOutput({
  fictional: { type: "boolean", const: true },
  residents: fcArray(
    fcObject({
      id: fcId,
      name: fcText,
      occupation: fcId,
      role: fcId,
      householdId: fcId,
      householdLabel: fcText,
    }),
    128,
    1,
  ),
  householdCounts: fcCountSchema,
  occupationCounts: fcCountSchema,
});
const isInput = (v: unknown): v is FictionalTownRosterInput =>
  matchesModelInput(v, inputSchema);
export const calculateFictionalTownRoster = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<FictionalTownRosterOutput, "randomness"> => {
      fcUnique(x.names, "names");
      fcUnique(x.occupations, "occupations");
      fcUnique(x.roles, "roles");
      fcUnique(
        x.households.map((h) => h.id),
        "households",
      );
      if (
        (!x.repeatNames && x.count > x.names.length) ||
        x.count > x.households.reduce((sum, h) => sum + h.capacity, 0)
      )
        simpleError(
          "count",
          "Names or household capacity cannot accommodate the resident count.",
          "infeasible_roster",
        );
      const names = [...x.names],
        used = new Map<string, number>();
      const residents = Array.from({ length: x.count }, (_, i) => {
        const name = fcPick(names, random);
        if (!x.repeatNames) names.splice(names.indexOf(name), 1);
        const h = fcPick(
          x.households.filter((v) => (used.get(v.id) ?? 0) < v.capacity),
          random,
        );
        used.set(h.id, (used.get(h.id) ?? 0) + 1);
        return {
          id: "resident-" + (i + 1),
          name,
          occupation: fcPick(x.occupations, random),
          role: fcPick(x.roles, random),
          householdId: h.id,
          householdLabel: h.label,
        };
      });
      return {
        fictional: true,
        residents,
        householdCounts: fcCounts(
          residents.map((v) => v.householdId),
          x.households.map((h) => h.id),
        ),
        occupationCounts: fcCounts(
          residents.map((v) => v.occupation),
          x.occupations,
        ),
      };
    },
  );
export const fictionalTownRosterExample = {
  input: {
    count: 2,
    names: ["Mira", "Orin", "Tessa"],
    occupations: ["baker", "scribe"],
    roles: ["host", "visitor"],
    households: [
      { id: "mill", label: "Old Mill", capacity: 1 },
      { id: "quay", label: "Quay House", capacity: 1 },
    ],
    repeatNames: false,
    seed: 42,
  },
  output: {
    fictional: true,
    residents: [
      {
        id: "resident-1",
        name: "Orin",
        occupation: "scribe",
        role: "visitor",
        householdId: "mill",
        householdLabel: "Old Mill",
      },
      {
        id: "resident-2",
        name: "Mira",
        occupation: "baker",
        role: "visitor",
        householdId: "quay",
        householdLabel: "Quay House",
      },
    ],
    householdCounts: [
      { id: "mill", count: 1 },
      { id: "quay", count: 1 },
    ],
    occupationCounts: [
      { id: "baker", count: 1 },
      { id: "scribe", count: 1 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  FictionalTownRosterInput,
  FictionalTownRosterOutput
>;
export const fictionalTownRosterTool = createModelDefinition<
  FictionalTownRosterInput,
  FictionalTownRosterOutput
>({
  id: "random/fictional-town-roster",
  title: "Random Fictional Town Roster Generator",
  description:
    "Compose fictional residents from supplied names, occupations, roles, and capacity-limited households with explicit name repetition and frequency counts.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalTownRoster,
});
export const runFictionalTownRoster = fictionalTownRosterTool.execute;
export default fictionalTownRosterTool;
