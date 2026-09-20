import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nInt,
  nWidth,
  nWrapped,
  nWrap,
  nSample,
  nDistinct,
  nRefs,
  nExpand,
  nTick,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type WorldbuildingDocumentBundleInput = NSeed & {
  readonly entities: readonly { readonly id: string; readonly value: string }[];
  readonly documents: readonly {
    readonly id: string;
    readonly kind: "notice" | "receipt" | "letter" | "map";
    readonly template: string;
    readonly entityIds: readonly string[];
    readonly references: readonly string[];
  }[];
  readonly count: number;
  readonly wrapWidth: number;
};
export type WorldbuildingDocumentBundleOutput = NReplay & {
  readonly documents: readonly {
    readonly id: string;
    readonly kind: "notice" | "receipt" | "letter" | "map";
    readonly body: NWrapped;
    readonly entityIds: readonly string[];
    readonly references: readonly string[];
  }[];
  readonly entityLedger: readonly {
    readonly id: string;
    readonly value: string;
  }[];
  readonly crossReferences: readonly {
    readonly from: string;
    readonly to: string;
  }[];
};
const entity = nObject({ id: nId, value: nText }),
  kind = {
    type: "string",
    enum: ["notice", "receipt", "letter", "map"],
  } as const;
export const inputSchema = nInput({
  entities: nArray(entity, 16, 1),
  documents: nArray(
    nObject({
      id: nId,
      kind,
      template: nText,
      entityIds: nArray(nId, 16),
      references: nArray(nId, 15),
    }),
    16,
    1,
  ),
  count: nInt(1, 16),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  documents: nArray(
    nObject({
      id: nId,
      kind,
      body: nWrapped,
      entityIds: nArray(nId, 16),
      references: nArray(nId, 15),
    }),
    16,
    1,
  ),
  entityLedger: nArray(entity, 16),
  crossReferences: nArray(nObject({ from: nId, to: nId }), 240),
});
const isInput = (v: unknown): v is WorldbuildingDocumentBundleInput =>
  matchesModelInput(v, inputSchema);
export const calculateWorldbuildingDocumentBundle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WorldbuildingDocumentBundleOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    const ids = x.documents.map((d) => d.id),
      entityIds = x.entities.map((e) => e.id);
    nDistinct(ids, "documents");
    nDistinct(entityIds, "entities");
    if (x.count > x.documents.length)
      return simpleError(
        "count",
        "Count exceeds supplied documents.",
        "infeasible_count",
      );
    const rendered = x.documents.map((d) => {
      nRefs(d.references, ids, "documents.references");
      nRefs(d.entityIds, entityIds, "documents.entityIds");
      if (d.references.includes(d.id))
        return simpleError(
          "documents.references",
          "A document cannot reference itself.",
          "self_reference",
        );
      const values = new Map(
        x.entities
          .filter((e) => d.entityIds.includes(e.id))
          .map((e) => ["entity:" + e.id, e.value]),
      );
      for (const id of d.entityIds)
        if (!d.template.includes("{entity:" + id + "}"))
          return simpleError(
            "documents.entityIds",
            "Declared entities must appear in the template.",
            "missing_entity_token",
          );
      return {
        id: d.id,
        kind: d.kind,
        body: nWrap(
          nExpand(d.template, values, "documents.template"),
          x.wrapWidth,
        ),
        entityIds: [...d.entityIds],
        references: [...d.references],
      };
    });
    const selected: typeof rendered = [],
      tick = nTick();
    const isRelatedClosedBundle = (): boolean => {
      if (
        !selected.every((d) =>
          d.references.every((id) => selected.some((s) => s.id === id)),
        )
      )
        return false;
      const first = selected[0];
      if (!first) return false;
      const connected = new Set([first.id]);
      for (let i = 0; i < selected.length; i++)
        for (const d of selected)
          if (
            !connected.has(d.id) &&
            selected.some(
              (s) =>
                connected.has(s.id) &&
                (d.references.includes(s.id) ||
                  s.references.includes(d.id) ||
                  d.entityIds.some((id) => s.entityIds.includes(id))),
            )
          )
            connected.add(d.id);
      return connected.size === selected.length;
    };
    const search = (): boolean => {
      tick();
      if (selected.length === x.count) return isRelatedClosedBundle();
      const choices = rendered.filter(
        (d) => !selected.some((s) => s.id === d.id),
      );
      for (const d of nSample(choices, choices.length, r)) {
        selected.push(d);
        if (search()) return true;
        selected.pop();
      }
      return false;
    };
    if (!search())
      return simpleError(
        "count",
        "No related reference-closed subset has the requested size.",
        "infeasible_reference_closure",
      );
    return {
      documents: selected,
      entityLedger: x.entities
        .filter((e) => selected.some((d) => d.entityIds.includes(e.id)))
        .map((e) => ({ ...e })),
      crossReferences: selected.flatMap((d) =>
        d.references.map((to) => ({ from: d.id, to })),
      ),
    };
  });
export const worldbuildingDocumentBundleExample = {
  input: {
    entities: [{ id: "port", value: "Harbor" }],
    documents: [
      {
        id: "n",
        kind: "notice",
        template: "Welcome to {entity:port}.",
        entityIds: ["port"],
        references: [],
      },
      {
        id: "r",
        kind: "receipt",
        template: "Paid at {entity:port}.",
        entityIds: ["port"],
        references: ["n"],
      },
    ],
    count: 2,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    documents: [
      {
        id: "r",
        kind: "receipt",
        body: { text: "Paid at Harbor.", lineCount: 1 },
        entityIds: ["port"],
        references: ["n"],
      },
      {
        id: "n",
        kind: "notice",
        body: { text: "Welcome to Harbor.", lineCount: 1 },
        entityIds: ["port"],
        references: [],
      },
    ],
    entityLedger: [{ id: "port", value: "Harbor" }],
    crossReferences: [{ from: "r", to: "n" }],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  WorldbuildingDocumentBundleInput,
  WorldbuildingDocumentBundleOutput
>;
export const worldbuildingDocumentBundleTool = createModelDefinition<
  WorldbuildingDocumentBundleInput,
  WorldbuildingDocumentBundleOutput
>({
  id: "random/worldbuilding-document-bundle",
  title: "Random Worldbuilding Document Bundle Generator",
  description:
    "Assemble a reference-closed bundle of supplied fictional notices, receipts, letters, or map descriptions with shared entity substitution and explicit cross-reference keys.",
  inputSchema,
  outputSchema,
  execute: calculateWorldbuildingDocumentBundle,
});
export const runWorldbuildingDocumentBundle =
  worldbuildingDocumentBundleTool.execute;
export default worldbuildingDocumentBundleTool;
