import { HabitForm } from "@/components/habits/HabitForm";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { useAddHabit } from "@/hooks/use-habits";
import { useRouter } from "expo-router";

export default function NewHabitScreen() {
  const router = useRouter();
  const addHabit = useAddHabit();

  return (
    <ScreenBackground>
      <HabitForm
        mode="create"
        isSubmitting={addHabit.isPending}
        onSubmit={(habit) => {
          addHabit.mutate(habit, {
            onSuccess: () => router.back(),
          });
        }}
      />
    </ScreenBackground>
  );
}
