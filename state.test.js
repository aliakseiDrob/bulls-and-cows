import { describe, it, expect } from 'vitest';
import { createInitialState, startRound, applyGuess, hasWon, getHistoryLength } from './state.js';
describe('gameState workflow', () => {
    const settings = { length: 4, base: 10 };
    describe('createInitialState', () => {
        it('creates an idle state with empty secret and history', () => {
            const state = createInitialState(settings);
            expect(state.settings).toEqual(settings);
            expect(state.secret).toBe('');
            expect(state.history).toEqual([]);
            expect(state.startTime).toBe(0);
            expect(state.status).toBe('idle');
        });
    });
    describe('startRound', () => {
        it('returns a new state with a generated secret and playing status', () => {
            const initial = createInitialState(settings);
            const started = startRound(initial, () => 0);
            expect(started.status).toBe('playing');
            expect(started.secret).toBe('0123');
            expect(started.history).toEqual([]);
            expect(started.startTime).toBeGreaterThan(0);
            expect(started.settings).toEqual(settings);
        });
        it('clears previous history and secret when restarting', () => {
            const initial = createInitialState(settings);
            const started = startRound(startRound(initial, () => 0.5), () => 0);
            expect(started.history).toEqual([]);
            expect(started.secret).toBe('0123');
        });
    });
    describe('applyGuess', () => {
        it('adds a valid guess to history', () => {
            const state = startRound(createInitialState(settings), () => 0);
            const next = applyGuess(state, '4567');
            expect(next.history).toHaveLength(1);
            expect(next.history[0].guess).toBe('4567');
            expect(next.history[0].bulls).toBe(0);
            expect(next.history[0].cows).toBe(0);
        });
        it('does not mutate the original state', () => {
            const state = startRound(createInitialState(settings), () => 0);
            applyGuess(state, '4567');
            expect(state.history).toEqual([]);
        });
        it('sets status to won when the guess matches the secret', () => {
            const state = startRound(createInitialState(settings), () => 0);
            const next = applyGuess(state, '0123');
            expect(next.status).toBe('won');
            expect(next.history[0].bulls).toBe(4);
            expect(next.history[0].cows).toBe(0);
        });
        it('ignores duplicate guesses case-insensitively', () => {
            const state = startRound(createInitialState({ length: 4, base: 16 }), () => 0);
            const afterFirst = applyGuess(state, '456a');
            const afterDuplicate = applyGuess(afterFirst, '456a');
            const afterCaseVariant = applyGuess(afterDuplicate, '456A');
            expect(afterDuplicate.history).toHaveLength(1);
            expect(afterCaseVariant.history).toHaveLength(1);
        });
        it('ignores invalid guesses', () => {
            const state = startRound(createInitialState(settings), () => 0);
            const next = applyGuess(state, '01234');
            expect(next.history).toEqual([]);
        });
        it('does nothing when the game is idle', () => {
            const state = createInitialState(settings);
            const next = applyGuess(state, '0123');
            expect(next.history).toEqual([]);
            expect(next.status).toBe('idle');
        });
        it('does nothing when the game is already won', () => {
            const state = startRound(createInitialState(settings), () => 0);
            const won = applyGuess(state, '0123');
            const next = applyGuess(won, '4567');
            expect(next.history).toHaveLength(1);
            expect(next.status).toBe('won');
        });
    });
    describe('hasWon', () => {
        it('returns true only for won status', () => {
            const idle = createInitialState(settings);
            const playing = startRound(idle, () => 0);
            const won = applyGuess(playing, '0123');
            expect(hasWon(idle)).toBe(false);
            expect(hasWon(playing)).toBe(false);
            expect(hasWon(won)).toBe(true);
        });
    });
    describe('getHistoryLength', () => {
        it('returns the number of history entries', () => {
            const state = startRound(createInitialState(settings), () => 0);
            const afterGuess = applyGuess(state, '4567');
            expect(getHistoryLength(state)).toBe(0);
            expect(getHistoryLength(afterGuess)).toBe(1);
        });
    });
});
