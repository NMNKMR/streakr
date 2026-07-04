import { HabitActionContent } from "@/components/habits/HabitActionContent";
import { useLocalSearchParams } from "expo-router";

/** Notification tap and card tap land here — quick log/start, not edit. */
export default function HabitActionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) return null;

  return <HabitActionContent habitId={id} />;
}
