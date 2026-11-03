import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

const PROJECT_ROOT = join(import.meta.dirname, '..');
const ENGINE_DIR = join(PROJECT_ROOT, 'src', 'engine');

const IMPORT_SPECIFIER = /(?:from\s*|import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)['"]/g;

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      return listSourceFiles(fullPath);
    }
    return /\.(?:ts|tsx)$/.test(entry.name) ? [fullPath] : [];
  });
}

function listImportSpecifiers(source: string): string[] {
  return [...source.matchAll(IMPORT_SPECIFIER)].map((match) => match[1] ?? '');
}

function isForbidden(specifier: string): boolean {
  return (
    specifier === 'react' ||
    specifier === 'react-dom' ||
    specifier.startsWith('react/') ||
    specifier.startsWith('react-dom/') ||
    specifier.includes('/ui/') ||
    specifier.startsWith('@/ui')
  );
}

describe('engine architectural boundaries', () => {
  it('contains source files to check', () => {
    expect(listSourceFiles(ENGINE_DIR).length).toBeGreaterThan(0);
  });

  it('does not import React or UI modules', () => {
    const violations: string[] = [];

    for (const file of listSourceFiles(ENGINE_DIR)) {
      const source = readFileSync(file, 'utf8');
      for (const specifier of listImportSpecifiers(source)) {
        if (isForbidden(specifier)) {
          violations.push(`${relative(ENGINE_DIR, file)} -> ${specifier}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
