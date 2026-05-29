import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult
} from '../core/result.js';
import {
  flashcardDeckFormat,
  flashcardDeckFormatVersion,
  type Flashcard,
  type FlashcardDeck,
  type FlashcardNote,
  type FlashcardNoteType
} from './types.js';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const deckKeys = new Set([
  'contentLanguage',
  'description',
  'format',
  'formatVersion',
  'id',
  'language',
  'license',
  'notes',
  'slug',
  'title'
]);
const noteKeys = new Set(['fields', 'id', 'noteType', 'tags']);
const fieldKeys = new Set(['back', 'front']);
const noteTypes = new Set<FlashcardNoteType>([
  'basic',
  'basic-and-reversed'
]);

const reportUnknownKeys = (
  value: Record<string, unknown>,
  allowed: ReadonlySet<string>,
  field: string,
  issues: ToolIssue[]
): void => {
  const unknown = Object.keys(value).filter((key) => !allowed.has(key));
  if (unknown.length > 0) {
    issues.push({
      code: 'unknown_field',
      field,
      message: `Unknown field${unknown.length === 1 ? '' : 's'}: ${unknown.join(', ')}.`
    });
  }
};

const readNote = (
  value: unknown,
  index: number,
  issues: ToolIssue[]
): FlashcardNote | null => {
  const field = `notes.${index}`;
  if (!isRecord(value)) {
    issues.push({
      code: 'invalid_note',
      field,
      message: 'Each note must be an object.'
    });
    return null;
  }

  const fields = value.fields;
  reportUnknownKeys(value, noteKeys, field, issues);
  if (isRecord(fields)) {
    reportUnknownKeys(fields, fieldKeys, `${field}.fields`, issues);
  }
  if (
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.noteType) ||
    !noteTypes.has(value.noteType as FlashcardNoteType) ||
    !isRecord(fields) ||
    !isNonEmptyString(fields.front) ||
    !isNonEmptyString(fields.back) ||
    !Array.isArray(value.tags) ||
    !value.tags.every(isNonEmptyString)
  ) {
    issues.push({
      code: 'invalid_note',
      field,
      message:
        'A note needs an id, a supported noteType, front and back text, and string tags.'
    });
    return null;
  }

  return {
    fields: {
      back: fields.back,
      front: fields.front
    },
    id: value.id,
    noteType: value.noteType as FlashcardNoteType,
    tags: value.tags
  };
};

export const validateFlashcardDeck = (
  value: unknown
): ToolResult<FlashcardDeck> => {
  const issues: ToolIssue[] = [];
  if (!isRecord(value)) {
    return invalidInput([
      {
        code: 'invalid_deck',
        field: 'deck',
        message: 'The deck must be a JSON object.'
      }
    ]);
  }

  reportUnknownKeys(value, deckKeys, 'deck', issues);
  if (value.format !== flashcardDeckFormat) {
    issues.push({
      code: 'invalid_format',
      field: 'format',
      message: `Expected "${flashcardDeckFormat}".`
    });
  }
  if (value.formatVersion !== flashcardDeckFormatVersion) {
    issues.push({
      code: 'unsupported_format_version',
      field: 'formatVersion',
      message: `Expected format version ${flashcardDeckFormatVersion}.`
    });
  }
  for (const field of ['id', 'slug', 'title'] as const) {
    if (!isNonEmptyString(value[field])) {
      issues.push({
        code: 'required',
        field,
        message: `${field} must be a non-empty string.`
      });
    }
  }
  if (
    isNonEmptyString(value.slug) &&
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)
  ) {
    issues.push({
      code: 'invalid_slug',
      field: 'slug',
      message: 'slug must use lowercase letters, numbers, and single hyphens.'
    });
  }
  for (const field of [
    'contentLanguage',
    'description',
    'language',
    'license'
  ] as const) {
    if (value[field] !== undefined && typeof value[field] !== 'string') {
      issues.push({
        code: 'invalid_field',
        field,
        message: `${field} must be a string when provided.`
      });
    }
  }
  if (!Array.isArray(value.notes)) {
    issues.push({
      code: 'required',
      field: 'notes',
      message: 'notes must be an array.'
    });
  }

  const notes = Array.isArray(value.notes)
    ? value.notes
        .map((note, index) => readNote(note, index, issues))
        .filter((note): note is FlashcardNote => note !== null)
    : [];

  if (new Set(notes.map((note) => note.id)).size !== notes.length) {
    issues.push({
      code: 'duplicate_note_id',
      field: 'notes',
      message: 'Note ids must be unique within a deck.'
    });
  }

  if (issues.length > 0) {
    return invalidInput(issues);
  }

  return toolSuccess({
    ...(typeof value.contentLanguage === 'string'
      ? { contentLanguage: value.contentLanguage }
      : {}),
    ...(typeof value.description === 'string'
      ? { description: value.description }
      : {}),
    format: flashcardDeckFormat,
    formatVersion: flashcardDeckFormatVersion,
    id: value.id as string,
    ...(typeof value.language === 'string'
      ? { language: value.language }
      : {}),
    ...(typeof value.license === 'string'
      ? { license: value.license }
      : {}),
    notes,
    slug: value.slug as string,
    title: value.title as string
  });
};

export const parseFlashcardDeck = (
  json: string
): ToolResult<FlashcardDeck> => {
  try {
    return validateFlashcardDeck(JSON.parse(json) as unknown);
  } catch {
    return invalidInput([
      {
        code: 'invalid_json',
        field: 'deck',
        message: 'The deck is not valid JSON.'
      }
    ]);
  }
};

export const exportFlashcardDeck = (deck: FlashcardDeck): string =>
  `${JSON.stringify(deck, null, 2)}\n`;

export const generateFlashcards = (
  deck: FlashcardDeck
): readonly Flashcard[] =>
  deck.notes.flatMap((note) => {
    const forward: Flashcard = {
      answer: note.fields.back,
      deckId: deck.id,
      direction: 'forward',
      id: `card:${encodeURIComponent(deck.id)}:${encodeURIComponent(note.id)}:forward`,
      noteId: note.id,
      prompt: note.fields.front,
      tags: note.tags
    };
    if (note.noteType === 'basic') {
      return [forward];
    }
    return [
      forward,
      {
        answer: note.fields.front,
        deckId: deck.id,
        direction: 'reverse',
        id: `card:${encodeURIComponent(deck.id)}:${encodeURIComponent(note.id)}:reverse`,
        noteId: note.id,
        prompt: note.fields.back,
        tags: note.tags
      }
    ];
  });
