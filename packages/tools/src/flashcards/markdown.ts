import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult
} from '../core/result.js';
import {
  flashcardDeckFormat,
  flashcardDeckFormatVersion,
  type FlashcardDeck,
  type FlashcardNote
} from './types.js';

const normalizeMarkdown = (markdown: string): string =>
  markdown.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');

const slugify = (value: string): string => {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'flashcard-deck';
};

const hash = (value: string): string => {
  let result = 0x811c9dc5;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 0x01000193);
  }
  return (result >>> 0).toString(36);
};

const normalizedIdentity = (value: string): string =>
  value.trim().replace(/\s+/g, ' ').normalize('NFKC');

const heading = (
  line: string
): { readonly depth: 1 | 2; readonly value: string } | null => {
  const match = /^ {0,3}(#{1,2})(?:[ \t]+(.*?)|[ \t]*)$/.exec(line);
  if (!match) return null;
  return {
    depth: match[1]?.length === 1 ? 1 : 2,
    value: (match[2] ?? '').replace(/[ \t]+#+[ \t]*$/, '').trim()
  };
};

const openingFence = (
  line: string
): { readonly character: '`' | '~'; readonly length: number } | null => {
  const match = /^ {0,3}(`{3,}|~{3,})/.exec(line);
  if (!match?.[1]) return null;
  return {
    character: match[1][0] as '`' | '~',
    length: match[1].length
  };
};

const closesFence = (
  line: string,
  fence: { readonly character: '`' | '~'; readonly length: number }
): boolean => {
  const marker = fence.character.repeat(fence.length);
  return new RegExp(`^ {0,3}${marker}${fence.character}*[ \\t]*$`).test(line);
};

export const parseFlashcardDeckMarkdown = (
  markdown: string
): ToolResult<FlashcardDeck> => {
  const lines = normalizeMarkdown(markdown).split('\n');
  const issues: ToolIssue[] = [];
  let title = '';
  let descriptionLines: string[] = [];
  let currentFront: string | null = null;
  let currentBack: string[] = [];
  let fence: ReturnType<typeof openingFence> = null;
  const rawNotes: { readonly back: string; readonly front: string }[] = [];

  const finishNote = (): void => {
    if (currentFront === null) return;
    const back = currentBack.join('\n').trim();
    if (!currentFront) {
      issues.push({
        code: 'empty_front',
        field: `notes.${rawNotes.length}.front`,
        message: 'Each level-two heading must contain a card front.'
      });
    }
    if (!back) {
      issues.push({
        code: 'empty_back',
        field: `notes.${rawNotes.length}.back`,
        message: `"${currentFront || 'Untitled card'}" needs an answer.`
      });
    }
    if (currentFront && back) {
      rawNotes.push({ back, front: currentFront });
    }
    currentFront = null;
    currentBack = [];
  };

  for (const line of lines) {
    if (fence) {
      if (currentFront === null) descriptionLines.push(line);
      else currentBack.push(line);
      if (closesFence(line, fence)) fence = null;
      continue;
    }

    const opened = openingFence(line);
    if (opened) {
      fence = opened;
      if (currentFront === null) descriptionLines.push(line);
      else currentBack.push(line);
      continue;
    }

    const parsedHeading = heading(line);
    if (parsedHeading?.depth === 1) {
      if (title) {
        issues.push({
          code: 'multiple_deck_titles',
          field: 'title',
          message: 'A Markdown deck may contain only one level-one heading.'
        });
      } else if (
        descriptionLines.some((descriptionLine) => descriptionLine.trim())
      ) {
        issues.push({
          code: 'content_before_title',
          field: 'title',
          message: 'The deck title must be the first Markdown content.'
        });
      } else {
        title = parsedHeading.value;
        descriptionLines = [];
      }
      continue;
    }

    if (parsedHeading?.depth === 2) {
      finishNote();
      currentFront = parsedHeading.value;
      continue;
    }

    if (currentFront === null) descriptionLines.push(line);
    else currentBack.push(line);
  }
  finishNote();

  if (!title) {
    issues.push({
      code: 'missing_deck_title',
      field: 'title',
      message: 'The deck needs one level-one heading for its title.'
    });
  }
  if (rawNotes.length === 0 && issues.length === 0) {
    issues.push({
      code: 'missing_cards',
      field: 'notes',
      message: 'The deck needs at least one level-two card heading and answer.'
    });
  }
  if (issues.length > 0) return invalidInput(issues);

  const slug = slugify(title);
  const occurrences = new Map<string, number>();
  const notes: FlashcardNote[] = rawNotes.map((note) => {
    const identity = normalizedIdentity(note.front);
    const occurrence = (occurrences.get(identity) ?? 0) + 1;
    occurrences.set(identity, occurrence);
    return {
      fields: note,
      id: `note-${hash(identity)}-${occurrence}`,
      noteType: 'basic',
      tags: []
    };
  });
  const description = descriptionLines.join('\n').trim();

  return toolSuccess({
    ...(description ? { description } : {}),
    format: flashcardDeckFormat,
    formatVersion: flashcardDeckFormatVersion,
    id: `deck-${slug}-${hash(normalizedIdentity(title))}`,
    notes,
    slug,
    title
  });
};

export const exportFlashcardDeckMarkdown = (
  deck: FlashcardDeck
): string => {
  const sections = [
    `# ${deck.title}`,
    ...(deck.description?.trim() ? [deck.description.trim()] : []),
    ...deck.notes.flatMap((note) => [
      `## ${note.fields.front.trim().replace(/\s*\n\s*/g, ' ')}`,
      note.fields.back.trim()
    ])
  ];
  return `${sections.join('\n\n')}\n`;
};
