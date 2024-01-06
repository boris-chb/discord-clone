interface ChatItemSkeletonProps {
  length?: number;
}

export default function ChatItemSkeleton({
  length = 6,
}: ChatItemSkeletonProps) {
  return (
    <div className="px-4 py-2 flex flex-col justify-end gap-4 h-full">
      {Array.from({ length }).map((_, index) => (
        <div
          key={index}
          className="mx-auto h-28 w-full rounded-md border border-blue-300/[.06] p-4 shadow"
        >
          <div className="flex animate-pulse space-x-4">
            <div className="h-10 w-10 rounded-full bg-slate-200/80"></div>
            <div className="flex-1 space-y-6 py-2">
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 h-1.5 rounded bg-slate-200/80"></div>
                  <div className="col-span-2 h-1.5 rounded bg-slate-200/80"></div>
                  <div className="col-span-1 h-1.5 rounded bg-slate-200/80"></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-2 h-1.5 rounded bg-slate-200/80"></div>
                  <div className="col-span-2 h-1.5 rounded bg-slate-200/80"></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1 h-1.5 rounded bg-slate-200/80"></div>
                  <div className="col-span-3 h-1.5 rounded bg-slate-200/80"></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 h-1.5 rounded bg-slate-200/80"></div>
                  <div className="col-span-1 h-1.5 rounded bg-slate-200/80"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
