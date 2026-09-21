import { Spinner } from "../ui/spinner";

export function PageLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner className="h-10 w-10" />
    </div>
  );
}