interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-20 text-label-neutral">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <p className="mb-8 text-sm">{message}</p>
      {action}
    </div>
  );
}
