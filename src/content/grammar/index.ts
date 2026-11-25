import type { GrammarTopic } from "./types";
import presentSimple from "./present-simple";
import presentContinuous from "./present-continuous";
import pastSimple from "./past-simple";
import presentPerfect from "./present-perfect";
import presentPerfectContinuous from "./present-perfect-continuous";
import future from "./future";
import modals from "./modals";
import comparatives from "./comparatives";
import prepositions from "./prepositions";
import articles from "./articles";

/**
 * Gramer konuları, önerilen çalışma sırasıyla.
 * Yeni konu eklemek için: yeni bir dosya oluştur (defineTopic ile) ve bu listeye ekle.
 */
export const GRAMMAR_TOPICS: GrammarTopic[] = [
  presentSimple,
  presentContinuous,
  pastSimple,
  presentPerfect,
  presentPerfectContinuous,
  future,
  modals,
  comparatives,
  prepositions,
  articles,
].sort((a, b) => a.order - b.order);

export const TOPIC_MAP: Record<string, GrammarTopic> = Object.fromEntries(GRAMMAR_TOPICS.map((t) => [t.id, t]));

export type { GrammarTopic, Exercise, ExerciseType } from "./types";
export { EXERCISE_TYPE_LABELS } from "./types";
